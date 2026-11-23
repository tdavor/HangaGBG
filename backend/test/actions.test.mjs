import test from "node:test";
import assert from "node:assert/strict";
import {action} from "../actions.mjs";

class TestStore {
  #rows = new Map();
  #key(collection,id) { return collection+"/"+id; }
  async get(collection,id) { return structuredClone(this.#rows.get(this.#key(collection,id))); }
  async getMany(collection,ids) {
    const entries=await Promise.all([...new Set(ids)].map(async id=>[String(id),await this.get(collection,id)]));
    return new Map(entries.filter(([,value])=>value));
  }
  put(collection,id,data) { this.#rows.set(this.#key(collection,id),structuredClone(data)); }
  remove(collection,id) { this.#rows.delete(this.#key(collection,id)); }
  async query(collection,filters=[],order,limit) {
    const rows=[...this.#rows].filter(([key])=>key.startsWith(collection+"/")).map(([,data])=>structuredClone(data));
    const matched=rows.filter(row=>filters.every(([field,op,value])=>{
      if (op==="EQUAL") return row[field]===value;
      if (op==="ARRAY_CONTAINS") return row[field].includes(value);
      if (op==="GREATER_THAN") return row[field]>value;
      if (op==="GREATER_THAN_OR_EQUAL") return row[field]>=value;
      throw new Error(op);
    }));
    if (order) matched.sort((a,b)=>Math.sign(a[order[0]]-b[order[0]])*(order[1]==="ASCENDING"?1:-1));
    return matched.slice(0,limit);
  }
}

async function app() {
  const db=new TestStore();
  const users=["org","guest","waiting"].map(uid=>({uid,email:uid+"@example.test",verified:true}));
  const call=(name,p={},index=0)=>action(db,name,p,index===null?null:users[index],{ADMIN_UID:"org"});
  const people=[];
  for (const [index,user] of users.entries()) people.push(await call("onboard",{adult:true,name:user.uid},index));
  const event={title:"Fika",area:"Centrum",place:"Café",start:new Date(Date.now()+4*3600000).toISOString(),
    price:0,capacity:1,category:"fika",quick:true};
  const {id}=await call("create",event);
  return {db,call,people,event,id,users};
}

test("capacity, waitlist, Android alert cursor and cancelled plans",async()=>{
  const {call,people,id}=await app();
  const device=await call("alerts_on",{},2);
  await call("join",{id,enabled:true},1);
  await call("join",{id,enabled:true},1);
  await assert.rejects(call("join",{id,enabled:true},2),{message:"full"});
  await call("waitlist",{id,enabled:true},2);
  assert.equal((await call("events",{},2))[0].waitlisted,true);
  assert.ok((await call("participants",{id})).some(p=>p.id===people[1].id));
  await assert.rejects(call("participants",{id},2),{message:"forbidden"});
  await call("join",{id,enabled:false},1);
  const poll=await call("poll",{token:device.token,after_id:device.cursor},null);
  assert.deepEqual(poll.map(a=>a.kind),["vacancy"]);
  await call("join",{id,enabled:true},2);
  await call("cancel",{id});
  assert.equal((await call("events",{},2))[0].cancelled,true);
  assert.deepEqual(await call("events",{},null),[]);
  assert.deepEqual((await call("poll",{token:device.token,after_id:poll[0].id},null)).map(a=>a.kind),["cancelled"]);
  await call("alerts_off",{token:device.token},2);
  await assert.rejects(call("poll",{token:device.token,after_id:0},null),{message:"forbidden"});
});

test("messages, access control and report resolution",async()=>{
  const {call,id,people}=await app();
  await assert.rejects(call("message",{id,recipient:people[0].id,body:"Hi!"},1),{message:"forbidden"});
  await call("join",{id,enabled:true},1);
  await call("message",{id,recipient:people[0].id,body:"Hi!"},1);
  assert.equal((await call("messages"))[0].body,"Hi!");
  assert.deepEqual(await call("messages",{},2),[]);
  await call("message",{id,recipient:people[1].id,body:"Welcome!"});
  const [reply]=await call("messages",{},1);
  await assert.rejects(call("report",{message:reply.id,reason:"Test"},2),{message:"missing"});
  await call("report",{message:reply.id,reason:"Test"},1);
  await assert.rejects(call("report",{message:reply.id,reason:"Test"},1),{message:"reported"});
  await call("resolve_report",{id:(await call("admin")).reports[0].id});
  assert.equal((await call("admin")).reports[0].resolved,true);
  await call("block_person",{id:people[0].id,enabled:true},1);
  await assert.rejects(call("message",{id,recipient:people[1].id,body:"Again"}),{message:"messageBlocked"});
  assert.deepEqual(await call("messages",{},1),[]);
  await assert.rejects(call("admin",{},1),{message:"forbidden"});
});

test("e-mail verification, closed registration and blocked account",async()=>{
  const {db,call,people,users,id}=await app();
  await call("admin_settings",{registration:false});
  const unknown={uid:"new",email:"new@example.test",verified:false};
  await assert.rejects(action(db,"onboard",{adult:true,name:"New"},unknown,{}),{message:"closed"});
  users[1].verified=false;
  await assert.rejects(call("join",{id,enabled:true},1),{message:"confirmEmail"});
  users[1].verified=true;
  await call("join",{id,enabled:true},1);
  await call("admin_block",{id:people[1].id,blocked:true});
  await assert.rejects(call("me",{},1),{message:"blocked"});
  assert.equal((await call("events"))[0].count,0);
});


test("participants can message each other only while joined to the same event",async()=>{
  const {call,id,event,people}=await app();
  await call("edit",{...event,id,capacity:2,category:"walk"});
  await call("join",{id,enabled:true},1);
  await assert.rejects(call("message",{id,recipient:people[2].id,body:"Hi"},1),{message:"forbidden"});
  await call("join",{id,enabled:true},2);
  assert.ok((await call("participants",{id},1)).some(p=>p.id===people[2].id));
  await call("message",{id,recipient:people[2].id,body:"See you"},1);
  assert.equal((await call("messages",{},2))[0].body,"See you");
  await call("join",{id,enabled:false},2);
  await assert.rejects(call("message",{id,recipient:people[2].id,body:"Hi"},1),{message:"forbidden"});
});

test("owners and admins can remove events with participants or after cancellation",async()=>{
  const {call,db,id,event,people}=await app();
  await call("join",{id,enabled:true},1);
  await assert.rejects(call("delete_event",{id},1),{message:"forbidden"});
  assert.equal((await call("delete_event",{id})).removedEvent,id);
  assert.equal(await db.get("events",id),undefined);
  assert.equal((await call("notices",{},1))[0].kind,"cancelled");
  const owned=await call("create",event,1);
  await call("cancel",{id:owned.id},1);
  assert.equal((await call("delete_event",{id:owned.id})).removedEvent,owned.id);
  await call("admin_block",{id:people[1].id,blocked:true});
  await call("admin_block",{id:people[1].id,blocked:false});
  assert.equal((await call("me",{},1)).blocked,false);
});

test("a recently reauthenticated user can delete their own account, including an admin",async()=>{
  const {call,people,users}=await app();
  await assert.rejects(call("delete_account"),{message:"reauth"});
  users[0].provider="password";
  users[0].authTime=Math.floor(Date.now()/1000);
  const deletion={deleteAuth:users[0].uid,profileId:people[0].id};
  assert.deepEqual(await call("delete_account"),deletion);
  assert.deepEqual(await call("delete_account"),deletion);
});

test("registered and legacy names block normalized duplicates while member details omit email",async()=>{
  const {db,call,people}=await app();
  await db.put("profiles",99,{id:99,name:"  Åsa   Lund  ",email:"legacy@example.test"});
  await assert.rejects(action(db,"onboard",{adult:true,name:"a\u030Asa lund"},
    {uid:"new",email:"new@example.test",verified:false},{}),{message:"nameTaken"});
  await assert.rejects(call("profile",{name:" GUEST "}),{message:"nameTaken"});
  await call("profile",{name:"Guest",bio:"Coffee and walks",languages:"Svenska, English"},1);
  const id=people[1].id;
  assert.deepEqual(await call("member_profile",{id}),{id,name:"Guest",bio:"Coffee and walks",languages:"Svenska, English",photo:"",meetups:[],canMessage:true,following:false});
  await assert.rejects(call("member_profile",{id},null),{message:"loginRequired"});
  await call("block_person",{id:people[0].id,enabled:true},1);
  await assert.rejects(call("member_profile",{id}),{message:"missing"});
});

test("private chat unread markers belong to the recipient and notifications identify the sender",async()=>{
  const {call,id,people}=await app();
  const [host,guest,outsider]=people;
  const device=await call("alerts_on",{},1);
  await call("join",{id,enabled:true},1);
  await call("message",{id,recipient:guest.id,body:"First"});
  const [first]=await call("chat_inbox",{},1);
  assert.equal(first.unread,true);
  assert.equal((await call("chat_inbox"))[0].unread,false);
  assert.deepEqual(await call("chat_inbox",{},2),[]);
  await assert.rejects(call("chat_read",{peer:host.id,through:first.id},2),{message:"missing"});
  await assert.rejects(call("chat_send",{peer:outsider.id,body:"Unexpected"},1),{message:"forbidden"});
  await call("chat_read",{peer:host.id,through:first.id},1);
  assert.equal((await call("chat_inbox",{},1))[0].unread,false);
  await call("chat_send",{peer:host.id,body:"Reply"},1);
  assert.equal((await call("chat_inbox"))[0].unread,true);
  const alerts=await call("poll",{token:device.token,after_id:device.cursor},null);
  assert.ok(alerts.some(a=>a.kind==="message"&&a.sender_id===host.id));
  await call("join",{id,enabled:false},1);
  await assert.rejects(call("chat_send",{peer:host.id,body:"After leaving"},1),{message:"forbidden"});
  await call("block_person",{id:host.id,enabled:true},1);
  assert.deepEqual(await call("chat_inbox",{},1),[]);
  assert.ok((await call("poll",{token:device.token,after_id:device.cursor},null)).every(a=>a.kind!=="message"));
});

test("FCM registration can only update the signed-in user's own device",async()=>{
  const {call,db,people}=await app();
  const device=await call("alerts_on",{},1);
  const payload={deviceToken:device.token,fcmToken:"example-fcm-registration-token"};
  await assert.rejects(call("push_register",payload,2),{message:"missing"});
  await call("push_register",payload,1);
  const [registered]=await db.query("devices",[["user_id","EQUAL",people[1].id]]);
  assert.equal(registered.fcmToken,payload.fcmToken);
  await call("alerts_off",{token:device.token},1);
  await assert.rejects(call("push_register",payload,1),{message:"missing"});
});

test("weekly meetups have separate RSVPs, preserve Stockholm wall time and never reuse notice IDs",async()=>{
  const {db,call,event,people}=await app();
  await call("follow_change",{id:people[0].id,enabled:true},1);
  // Simulate Firestore transaction reads, which cannot see uncommitted writes.
  const sequence=await db.get("settings","sequence");
  const get=db.get.bind(db),put=db.put.bind(db);
  db.root="test";db.writes=new Map();
  db.get=(collection,id)=>collection==="settings"&&id==="sequence"?Promise.resolve(sequence):get(collection,id);
  db.put=(collection,id,row)=>{
    put(collection,id,row);
    if(collection==="settings"&&id==="sequence") db.writes.set("test/settings/sequence",{update:{fields:{last:{integerValue:String(row.last)}}}});
  };
  const start="2027-03-21T09:00:00.000Z";
  const {id}=await call("create",{...event,quick:false,start,repeatCount:3,meetingNote:"Blue jacket",meetingMap:"https://maps.app.goo.gl/example"});
  const rows=(await call("events")).filter(e=>e.series===id);
  assert.deepEqual(rows.map(e=>e.start),[start,"2027-03-28T08:00:00.000Z","2027-04-04T08:00:00.000Z"]);
  const notices=await db.query("notices");
  assert.ok(notices.some(n=>n.kind==="following"));
  assert.ok(notices.every(n=>n.id>id+2));
  await call("join",{id,enabled:true},1);
  assert.deepEqual((await call("events",{},1)).filter(e=>e.series===id).map(e=>e.joined),[true,false,false]);
  await assert.rejects(call("create",{...event,quick:false,meetingMap:"javascript:alert(1)"}),{message:"invalid"});
});

test("group chat is limited to participants and respects blocks, reports and leaving",async()=>{
  const {call,id,people}=await app();
  await assert.rejects(call("group_messages",{id},2),{message:"forbidden"});
  await call("join",{id,enabled:true},1);
  await call("group_send",{id,body:"By the entrance"});
  const [message]=await call("group_messages",{id},1);
  assert.equal(message.body,"By the entrance");
  assert.equal(message.email,undefined);
  await call("group_send",{id,body:"See you"},1);
  await call("report",{group:message.id,reason:"Test"},1);
  assert.ok((await call("admin")).reports.some(r=>r.context.includes("By the entrance")));
  await assert.rejects(call("report",{group:message.id,reason:"Test"},2),{message:"missing"});
  await call("join",{id,enabled:false},1);
  await assert.rejects(call("group_send",{id,body:"After leaving"},1),{message:"forbidden"});
  await call("join",{id,enabled:true},1);
  await call("block_person",{id:people[0].id,enabled:true},1);
  await assert.rejects(call("group_messages",{id},1),{message:"missing"});
});

test("attendance and feedback prompts are idempotent and feedback stays private",async()=>{
  const {db,call,id,event,people}=await app();
  await call("join",{id,enabled:true},1);
  await call("due_notices",{id},null);
  await call("due_notices",{id},null);
  assert.equal((await call("notices",{},1)).filter(n=>n.kind==="attendance").length,1);
  await call("attendance",{id},1);
  assert.equal((await call("events",{},1)).find(e=>e.id===id).confirmed,true);
  await assert.rejects(call("attendance",{id},2),{message:"forbidden"});
  await call("edit",{...event,id,start:new Date(Date.parse(event.start)+3600000).toISOString()});
  assert.equal((await call("events",{},1)).find(e=>e.id===id).confirmed,false);
  await assert.rejects(call("feedback_save",{id,welcome:"yes",again:"yes",note:"Nice"},1),{message:"past"});
  const row=await db.get("events",id);
  db.put("events",id,{...row,start:new Date(Date.now()-7200000).toISOString(),end:new Date(Date.now()-3600000).toISOString()});
  await call("due_notices",{id},null);
  await call("due_notices",{id},null);
  assert.equal((await call("notices",{},1)).filter(n=>n.kind==="feedback").length,1);
  await call("feedback_save",{id,welcome:"yes",again:"maybe",note:"Nice"},1);
  assert.equal((await call("feedback_get",{id},1)).note,"Nice");
  assert.deepEqual(await call("feedback_get",{id}),{});
  await assert.rejects(call("feedback_get",{id},2),{message:"forbidden"});
  await assert.rejects(call("admin",{},1),{message:"forbidden"});
  assert.equal((await call("admin")).feedback.find(f=>f.user_id===people[1].id).note,"Nice");
});

test("availability expires at local midnight and follows respect blocking",async()=>{
  const {db,call,people}=await app();
  const format=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Stockholm",year:"numeric",month:"2-digit",day:"2-digit"});
  const day=format.format(new Date());
  const {localInstant}=await import("../community.mjs");
  const midnight=localInstant(new Date(Date.parse(day+"T00:00:00Z")+86400000).toISOString().slice(0,10)+"T00:00:00");
  await call("availability_save",{area:"Centrum",activity:"walk",from:new Date().toISOString(),until:new Date(midnight).toISOString()},1);
  const [available]=await call("availability_list");
  assert.equal(available.user_id,people[1].id);
  assert.equal(available.email,undefined);
  await assert.rejects(call("availability_save",{area:"Centrum",activity:"walk",from:new Date().toISOString(),until:new Date(midnight+60000).toISOString()},1),{message:"invalid"});
  db.put("availability",people[1].id,{...available,until:new Date(Date.now()-1).toISOString()});
  assert.deepEqual(await call("availability_list"),[]);
  await call("follow_change",{id:people[0].id,enabled:true},1);
  assert.equal((await call("follow_list",{},1))[0].id,people[0].id);
  await call("block_person",{id:people[0].id,enabled:true},1);
  assert.deepEqual(await call("follow_list",{},1),[]);
});

test("scheduled prompt batches skip completed meetups and resume at the next one",async()=>{
  const {db,call,id,event}=await app();
  const {pendingPrompts}=await import('../community.mjs');
  for(let i=0;i<6;i++) db.put('events',100+i,{...event,id:100+i,owner:1});
  const events=await db.query('events');
  const first=await pendingPrompts(db,events);
  assert.equal(first.length,4);
  for(const row of first) await call('due_notices',{id:row.id},null);
  const next=await pendingPrompts(db,events);
  assert.equal(next.length,3);
  assert.ok(next.every(row=>!first.some(done=>done.id===row.id)));
});

test("private history and message alerts survive permanent event cleanup",async()=>{
  const {removeEventRelations}=await import('../index.mjs');
  const {db,call,id,people}=await app();
  const device=await call('alerts_on',{},1);
  await call('join',{id,enabled:true},1);
  await call('message',{id,recipient:people[1].id,body:'Keep this conversation'});
  const [before]=await call('chat_inbox',{},1);
  await call('delete_event',{id});
  db.writes=new Map();db.send=async()=>({});
  await removeEventRelations(db,id);
  assert.equal(await db.get('events',id),undefined);
  assert.equal((await call('chat_inbox',{},1))[0].body,before.body);
  assert.equal((await call('messages'))[0].body,before.body);
  assert.ok((await call('notices',{},1)).some(n=>n.kind==='message'));
  assert.ok((await call('poll',{token:device.token,after_id:device.cursor},null)).some(n=>n.kind==='message'));
  await call('chat_read',{peer:people[0].id,through:before.id},1);
  assert.equal((await call('chat_inbox',{},1))[0].unread,false);
  // Retaining history does not bypass the shared-meetup requirement for new messages.
  await assert.rejects(call('chat_send',{peer:people[0].id,body:'After event deletion'},1),{message:'forbidden'});
});

test("message and conversation deletion affect only the caller and never hide later messages",async()=>{
  const {call,id,people,db}=await app();
  const [host,guest]=people;
  const device=await call('alerts_on',{},1);
  await call('join',{id,enabled:true},1);
  await call('message',{id,recipient:guest.id,body:'First'});
  const [first]=await call('chat_inbox',{},1);
  await assert.rejects(call('chat_delete',{peer:host.id,message:first.id},2),{message:'missing'});
  await assert.rejects(call('chat_delete',{peer:people[2].id,message:first.id},1),{message:'missing'});
  await call('chat_delete',{peer:host.id,message:first.id},1);
  assert.deepEqual(await call('chat_inbox',{},1),[]);
  assert.equal((await call('chat_inbox')).length,1);
  assert.ok(await db.get('messages',first.id));
  assert.ok((await call('poll',{token:device.token,after_id:device.cursor},null)).every(n=>n.kind!=='message'));
  await call('chat_send',{peer:host.id,body:'Reply'},1);
  const [reply]=await call('chat_inbox',{},1);
  await call('chat_delete',{peer:host.id,through:reply.id},1);
  assert.deepEqual(await call('chat_inbox',{},1),[]);
  assert.equal((await call('chat_inbox')).length,2);
  await call('chat_send',{peer:guest.id,body:'New message'});
  const [latest]=await call('chat_inbox',{},1);
  assert.equal(latest.body,'New message');assert.equal(latest.unread,true);
  await call('chat_read',{peer:host.id,through:latest.id},1);
  assert.equal((await call('chat_inbox',{},1)).length,1);
  assert.equal((await call('chat_inbox',{},1))[0].unread,false);
  assert.equal((await call('notices',{},1)).filter(n=>n.kind==='message').length,1);
});

test('availability edits replace the own entry and deletion leaves other members unchanged',async()=>{
  const {db,call,people}=await app();
  const from=new Date().toISOString();
  const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Stockholm',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const {localInstant}=await import('../community.mjs');
  const next=new Date(Date.parse(date+'T00:00:00Z')+86400000).toISOString().slice(0,10);
  const until=new Date(localInstant(next+'T00:00:00')).toISOString();
  const value={area:'Centrum',activity:'fika',from,until};
  await call('availability_save',value);
  await call('availability_save',value,1);
  await call('availability_save',{...value,area:'Tuve',activity:'walk'});
  assert.equal((await db.query('availability')).length,2);
  assert.equal((await db.get('availability',people[0].id)).area,'Tuve');
  await call('availability_save',{enabled:false,user_id:people[1].id});
  assert.equal(await db.get('availability',people[0].id),undefined);
  assert.ok(await db.get('availability',people[1].id));
});

test('ideas invite interested members to confirm and activate only after the organizer and minimum accept',async()=>{
  const {call,event,people}=await app();
  const {id}=await call('create',{...event,quick:false,capacity:2,minPeople:3,category:'walk',walkGoal:'view'});
  const get=async (i=0)=>(await call('events',{},i)).find(e=>e.id===id);
  await assert.rejects(call('join',{id,enabled:true},1),{message:'forbidden'});
  await call('interest',{id,enabled:true},1);
  assert.equal((await get(1)).interested,true);assert.equal((await get()).proposalPhase,'collecting');
  await call('interest',{id,enabled:true},1);
  assert.equal((await get()).interestCount,1);
  await call('interest',{id,enabled:true},2);
  assert.equal((await get()).proposalPhase,'confirming');
  assert.ok((await call('notices',{},1)).some(n=>n.kind==='proposalReady'));
  await call('proposal_confirm',{id},1);await call('proposal_confirm',{id},2);
  assert.equal((await get()).proposalPhase,'confirming');
  assert.equal((await get(1)).joined,false);
  await call('proposal_confirm',{id});
  assert.equal((await get()).proposalPhase,'active');
  assert.equal((await get(1)).joined,true);assert.equal((await get(2)).joined,true);
  assert.equal((await get()).count,2);
  assert.equal((await call('participants',{id})).length,3);
  assert.ok((await call('notices',{},1)).some(n=>n.kind==='proposalActive'));
  await call('join',{id,enabled:false},1);
  assert.equal((await get()).proposalPhase,'active');assert.equal((await get()).count,1);
});

test('withdrawal and schedule edits invalidate proposal confirmations without creating RSVPs',async()=>{
  const {call,event}=await app();
  const value={...event,quick:false,capacity:3,minPeople:3};
  const {id}=await call('create',value);
  await call('interest',{id,enabled:true},1);await call('interest',{id,enabled:true},2);
  await call('proposal_confirm',{id});await call('proposal_confirm',{id},1);
  await call('interest',{id,enabled:false},2);
  let row=(await call('events',{},1)).find(e=>e.id===id);
  assert.equal(row.proposalPhase,'collecting');assert.equal(row.proposalConfirmed,false);assert.equal(row.count,0);
  await call('interest',{id,enabled:true},2);await call('proposal_confirm',{id},1);
  await call('edit',{...value,id,start:new Date(Date.parse(event.start)+3600000).toISOString()});
  row=(await call('events',{},1)).find(e=>e.id===id);
  assert.equal(row.proposalConfirmed,false);assert.equal(row.count,0);assert.equal(row.joined,false);
  await assert.rejects(call('edit',{...value,id,minPeople:2}),{message:'invalid'});
  await assert.rejects(call('create',{...value,repeatCount:2}),{message:'invalid'});
  await assert.rejects(call('create',{...value,minPeople:5}),{message:'invalid'});
  await assert.rejects(call('create',{...value,walkGoal:'invalid'}),{message:'invalid'});
});

test('meet-again choices remain private until mutual, cannot expose rejections and notify only the pair',async()=>{
  const {call,db,event,id,people}=await app();
  await call('edit',{...event,id,capacity:2});
  await call('join',{id,enabled:true},1);await call('join',{id,enabled:true},2);
  await assert.rejects(call('again_list',{id},1),{message:'forbidden'});
  const row=await db.get('events',id);
  db.put('events',id,{...row,start:new Date(Date.now()-7200000).toISOString(),end:new Date(Date.now()-3600000).toISOString()});
  await assert.rejects(call('again_change',{id,peer:people[0].id},1),{message:'invalid'});
  await call('again_change',{id,peer:people[0].id,enabled:true},1);
  let hostView=await call('again_list',{id});
  assert.deepEqual(hostView.find(p=>p.id===people[1].id),{id:people[1].id,name:'guest',selected:false,matched:false});
  assert.equal((await call('notices')).filter(n=>n.kind==='again').length,0);
  await call('again_change',{id,peer:people[1].id,enabled:true});
  assert.equal((await call('again_list',{id})).find(p=>p.id===people[1].id).matched,true);
  assert.equal((await call('again_list',{id},1)).find(p=>p.id===people[0].id).matched,true);
  assert.ok((await call('again_list',{id},2)).every(p=>!p.selected&&!p.matched));
  assert.equal((await call('notices',{},2)).filter(n=>n.kind==='again').length,0);
  assert.equal((await call('notices')).find(n=>n.kind==='again').name,'guest');
  assert.equal((await call('notices',{},1)).find(n=>n.kind==='again').name,'org');
  await call('again_change',{id,peer:people[1].id,enabled:true});
  assert.equal((await call('notices')).filter(n=>n.kind==='again').length,1);
  await call('block_person',{id:people[1].id,enabled:true});
  assert.ok((await call('again_list',{id})).every(p=>p.id!==people[1].id));
  await assert.rejects(call('again_change',{id,peer:people[1].id,enabled:true}),{message:'missing'});
});

test('meet-again rejects outsiders, supports private undo, and account deletion clears its choices',async()=>{
  const {call,db,id,people}=await app();
  await call('join',{id,enabled:true},1);
  const event=await db.get('events',id);
  db.put('events',id,{...event,start:new Date(Date.now()-7200000).toISOString(),end:new Date(Date.now()-3600000).toISOString()});
  await assert.rejects(call('again_list',{id},2),{message:'forbidden'});
  await assert.rejects(call('again_change',{id,peer:people[2].id,enabled:true}),{message:'missing'});
  await call('again_change',{id,peer:people[1].id,enabled:true});
  await call('again_change',{id,peer:people[1].id,enabled:false});
  assert.equal((await call('again_list',{id}))[0].selected,false);
  await call('again_change',{id,peer:people[1].id,enabled:true});
  await call('again_change',{id,peer:people[0].id,enabled:true},1);
  await call('admin_delete',{id:people[1].id});
  assert.deepEqual(await db.query('again_choices'),[]);assert.deepEqual(await db.query('again_matches'),[]);assert.deepEqual(await db.query('again_pairs'),[]);assert.deepEqual(await db.query('friendships'),[]);
});

test('blocking an interested account resets an unconfirmed idea and never creates RSVPs',async()=>{
  const {call,event,people}=await app();
  const {id}=await call('create',{...event,quick:false,capacity:2,minPeople:3});
  await call('interest',{id,enabled:true},1);await call('interest',{id,enabled:true},2);
  await call('proposal_confirm',{id},1);
  await call('admin_block',{id:people[2].id,blocked:true});
  const row=(await call('events',{},1)).find(e=>e.id===id);
  assert.equal(row.proposalPhase,'collecting');assert.equal(row.count,0);assert.equal(row.proposalConfirmed,false);
});

async function endedPair() {
  const value=await app();
  await value.call('join',{id:value.id,enabled:true},1);
  const event=await value.db.get('events',value.id);
  value.db.put('events',value.id,{...event,start:new Date(Date.now()-7200000).toISOString(),end:new Date(Date.now()-3600000).toISOString()});
  return value;
}

test('friendship requires mutual consent and lets an empty conversation start after event deletion',async()=>{
  const {call,db,id,people}=await endedPair();
  const [host,guest]=people;
  const device=await call('alerts_on',{},1);
  await assert.rejects(call('friend_request',{peer:host.id},2),{message:'forbidden'});
  assert.equal((await call('friend_status',{peer:guest.id})).canRequest,true);
  await call('friend_request',{peer:guest.id});
  await call('friend_request',{peer:guest.id});
  assert.equal((await call('friend_list',{},1))[0].direction,'incoming');
  assert.equal((await call('notices',{},1)).filter(n=>n.kind==='friendRequest').length,1);
  assert.ok((await call('poll',{token:device.token,after_id:device.cursor},null)).some(n=>n.kind==='friendRequest'&&n.event_id===0));
  await assert.rejects(call('friend_reply',{peer:guest.id,accept:true}),{message:'forbidden'});
  await call('delete_event',{id});
  await assert.rejects(call('chat_send',{peer:host.id,body:'Before acceptance'},1),{message:'forbidden'});
  await call('friend_reply',{peer:host.id,accept:true},1);
  const [friend]=await call('friend_list');
  assert.equal(friend.status,'accepted');assert.equal(friend.email,undefined);
  assert.equal((await call('chat_peer',{peer:host.id},1)).canSend,true);
  const sent=await call('chat_send',{peer:host.id,body:'We can keep in touch'},1);
  assert.equal(sent.pushChat.owner,host.id);
  assert.equal((await call('chat_inbox'))[0].body,'We can keep in touch');
  assert.equal((await call('chat_inbox'))[0].event_id,0);
  assert.equal((await call('notices')).filter(n=>n.kind==='friendAccepted').length,1);
});

test('a mutual meet-again choice creates a durable friendship without exposing unilateral choices',async()=>{
  const {call,db,id,people}=await endedPair();
  await call('again_change',{id,peer:people[1].id,enabled:true});
  assert.deepEqual(await call('friend_list'),[]);
  await call('again_change',{id,peer:people[0].id,enabled:true},1);
  assert.equal((await call('friend_list'))[0].status,'accepted');
  await call('delete_event',{id});
  const {removeEventRelations}=await import('../index.mjs');
  db.writes=new Map();db.send=async()=>({});await removeEventRelations(db,id);
  assert.equal((await call('friend_list')).length,1);
  await call('chat_send',{peer:people[1].id,body:'Next time?'});
  assert.equal((await call('chat_inbox',{},1))[0].body,'Next time?');
});

test('friend invitations require sender attendance, stay private and never RSVP for the recipient',async()=>{
  const {call,db,event,people}=await endedPair();
  await call('friend_request',{peer:people[1].id});await call('friend_reply',{peer:people[0].id,accept:true},1);
  const next=await call('create',{...event,quick:false,capacity:3},2);
  await assert.rejects(call('friend_invite',{id:next.id,peer:people[1].id}),{message:'forbidden'});
  await call('save',{id:next.id,enabled:true});
  await assert.rejects(call('friend_invite',{id:next.id,peer:people[1].id}),{message:'forbidden'});
  await call('join',{id:next.id,enabled:true});
  await call('friend_invite',{id:next.id,peer:people[1].id,lang:'en'});
  const [invite]=await call('chat_inbox',{},1);
  assert.equal(invite.invite_event,next.id);assert.equal(invite.invite_available,true);
  assert.match(invite.body,/Would you like to join me/);
  assert.equal(await db.get('plans',next.id+'-'+people[1].id),undefined);
  assert.deepEqual(await call('chat_inbox',{},2),[]);
  await call('delete_event',{id:next.id},2);
  assert.equal((await call('chat_inbox',{},1))[0].invite_available,false);
});

test('friend removal preserves history, blocks revoke contact, and declined requests cannot be spammed',async()=>{
  const {call,id,db,people,users}=await endedPair();
  await call('friend_request',{peer:people[1].id});
  await call('friend_reply',{peer:people[0].id,accept:false},1);
  await assert.rejects(call('friend_request',{peer:people[1].id}),{message:'forbidden'});
  await call('friend_remove',{peer:people[1].id});
  await assert.rejects(call('friend_request',{peer:people[1].id}),{message:'forbidden'});
  const key=Math.min(people[0].id,people[1].id)+'-'+Math.max(people[0].id,people[1].id);
  db.put('friendships',key,{id:key,users:[people[0].id,people[1].id],requester:people[0].id,status:'accepted'});
  await call('chat_send',{peer:people[1].id,body:'Keep the history'});
  await call('delete_event',{id});
  await call('friend_remove',{peer:people[0].id},1);
  assert.equal((await call('chat_inbox',{},1))[0].body,'Keep the history');
  const original=await db.get('profiles',people[0].id);
  db.put('profiles',people[0].id,{...original,admin:false});
  await assert.rejects(action(db,'chat_send',{peer:people[1].id,body:'No longer friends'},users[0],{ADMIN_UID:'different'}),{message:'forbidden'});
  db.put('profiles',people[0].id,original);
  await call('friend_request',{peer:people[1].id});
  await call('friend_reply',{peer:people[0].id,accept:true},1);
  await call('block_person',{id:people[0].id,enabled:true},1);
  assert.deepEqual(await call('friend_list'),[]);
  await assert.rejects(call('chat_send',{peer:people[1].id,body:'Blocked'}),{message:'messageBlocked'});
  assert.deepEqual(await db.query('friendships'),[]);
});

test('admins can initiate private contact without an event and only the contacted user gains reply permission',async()=>{
  const {call,people,id,db,users}=await app();
  const [admin,other,contact]=people;
  const device=await call('alerts_on',{},2);
  assert.equal((await call('chat_peer',{peer:contact.id})).canSend,true);
  assert.equal((await call('chat_peer',{peer:contact.id},1)).canSend,false);
  await assert.rejects(call('chat_send',{peer:admin.id,body:'Unsolicited'},1),{message:'forbidden'});
  const sent=await call('chat_send',{peer:contact.id,body:'Hello from the administrator'});
  assert.equal(sent.pushChat.owner,contact.id);
  const [first]=await call('chat_inbox',{},2);
  assert.equal(first.admin_message,true);assert.equal(first.event_id,0);assert.equal(first.unread,true);
  assert.equal((await call('chat_peer',{peer:admin.id},2)).adminContact,true);
  assert.equal((await call('chat_peer',{peer:admin.id},2)).canSend,true);
  await call('delete_event',{id});
  await call('chat_send',{peer:admin.id,body:'My reply'},2);
  assert.equal((await call('chat_inbox'))[0].body,'My reply');
  assert.deepEqual(await call('chat_inbox',{},1),[]);
  await assert.rejects(call('chat_read',{peer:admin.id,through:first.id},1),{message:'missing'});
  assert.ok((await call('poll',{token:device.token,after_id:device.cursor},null)).some(n=>n.kind==='message'&&n.sender_id===admin.id));
  const profile=await db.get('profiles',admin.id);db.put('profiles',admin.id,{...profile,admin:false});
  assert.equal((await action(db,'chat_peer',{peer:admin.id},users[2],{ADMIN_UID:'different'})).canSend,false);
  await assert.rejects(action(db,'chat_send',{peer:admin.id,body:'After role revocation'},users[2],{ADMIN_UID:'different'}),{message:'forbidden'});
});

test('admin contact cannot be spoofed and does not bypass blocks or grant access to other private chats',async()=>{
  const {call,db,people}=await app();
  await assert.rejects(call('chat_send',{peer:people[2].id,body:'Pretending',admin:true,admin_message:true},1),{message:'forbidden'});
  db.put('friendships',people[1].id+'-'+people[2].id,{id:people[1].id+'-'+people[2].id,users:[people[1].id,people[2].id],status:'accepted',requester:people[1].id});
  await call('chat_send',{peer:people[2].id,body:'Private between users',admin_message:true},1);
  const [privateMessage]=await call('chat_inbox',{},2);
  assert.equal(privateMessage.admin_message,undefined);
  assert.deepEqual(await call('chat_inbox'),[]);
  await assert.rejects(call('chat_read',{peer:people[1].id,through:privateMessage.id}),{message:'missing'});
  await call('block_person',{id:people[0].id,enabled:true},2);
  await assert.rejects(call('chat_send',{peer:people[2].id,body:'Blocked contact'}),{message:'messageBlocked'});
  await call('admin_block',{id:people[1].id,blocked:true});
  await assert.rejects(call('chat_send',{peer:people[1].id,body:'Inactive account'}),{message:'missing'});
});

test('profile photos belong to the caller, stay out of identity lists and are removed with the account',async()=>{
  const {jpeg}=await import('./fixtures/photo.mjs');
  const {db,call,people,users}=await app();
  const uid=people[1].id;
  await assert.rejects(call('profile_photo',{photo:jpeg},null),{message:'loginRequired'});
  assert.deepEqual(await call('profile_photo',{photo:jpeg,id:people[2].id},1),{photo:jpeg});
  assert.equal((await db.get('profile_photos',uid)).data,jpeg);
  assert.equal(await db.get('profile_photos',people[2].id),undefined);
  assert.equal((await db.get('profiles',uid)).photo,undefined);
  assert.equal((await call('me',{},1)).photo,jpeg);
  assert.equal((await call('profile',{name:'guest',bio:'Coffee',languages:'Svenska'},1)).photo,jpeg);
  const publicMember=await call('member_profile',{id:uid},2);
  assert.equal(publicMember.photo,jpeg);
  assert.equal(publicMember.email,undefined);assert.equal(publicMember.uid,undefined);
  assert.equal(publicMember.canMessage,false);
  await assert.rejects(call('chat_send',{peer:uid,body:'Unsolicited'},2),{message:'forbidden'});
  await call('profile_photo',{photo:''},1);
  assert.equal((await call('me',{},1)).photo,'');
  assert.equal(await db.get('profile_photos',uid),undefined);
  await call('profile_photo',{photo:jpeg},1);
  users[1].provider='password';users[1].authTime=Date.now()/1000;
  await call('delete_account',{},1);
  assert.equal(await db.get('profile_photos',uid),undefined);
});

test('profile photo validation rejects active formats, oversized, malformed and oversized-dimension data',async()=>{
  const {jpeg}=await import('./fixtures/photo.mjs');
  const {call}=await app();
  for(const photo of [null,'https://example.test/x.jpg','data:image/svg+xml;base64,PHN2Zz4=',jpeg+'x',jpeg.repeat(150),'data:image/jpeg;base64,YWJj']) {
    await assert.rejects(call('profile_photo',{photo},1),{message:'invalid'});
  }
  const bytes=Buffer.from(jpeg.slice(23),'base64');
  const sof=bytes.indexOf(Buffer.from([255,192]));assert.ok(sof>0);
  bytes[sof+5]=10;bytes[sof+6]=0;
  await assert.rejects(call('profile_photo',{photo:'data:image/jpeg;base64,'+bytes.toString('base64')},1),{message:'invalid'});
});

test('member event lists expose organized and joined meetups without saved, private or blocked-owner details',async()=>{
  const {call,db,people,event,id}=await app();
  await call('join',{id,enabled:true},1);
  const owned=await call('create',{...event,title:'Guest walk',capacity:3},1);
  const saved=await call('create',{...event,title:'Saved only',capacity:3});
  await call('save',{id:saved.id,enabled:true},1);
  const hidden=await call('create',{...event,title:'Hidden',capacity:3},1);
  db.put('events',hidden.id,{...await db.get('events',hidden.id),hidden:true,meetingNote:'secret',email:'secret@test.invalid'});
  const cancelled=await call('create',{...event,title:'Cancelled'},1);
  await call('cancel',{id:cancelled.id},1);
  let member=await call('member_profile',{id:people[1].id},2);
  assert.deepEqual(new Set(member.meetups.map(e=>e.id)),new Set([id,owned.id]));
  assert.equal(member.meetups.find(e=>e.id===id).organized,false);
  assert.equal(member.meetups.find(e=>e.id===owned.id).organized,true);
  assert.doesNotMatch(JSON.stringify(member),/@|meetingNote|authTime|email|uid/);
  await call('block_person',{id:people[0].id,enabled:true},2);
  member=await call('member_profile',{id:people[1].id},2);
  assert.deepEqual(member.meetups.map(e=>e.id),[owned.id]);
  await call('block_person',{id:people[1].id,enabled:true},2);
  await assert.rejects(call('member_profile',{id:people[1].id},2),{message:'missing'});
});

test('any registered member can view available members and photos and send one private meetup suggestion',async()=>{
  const {call,db,people}=await app();const {jpeg}=await import('./fixtures/photo.mjs');
  const from=new Date(Date.now()-60000).toISOString(),until=new Date(Date.now()+30*60000).toISOString();
  // Time-independent fixture: the action validates the Stockholm day at request time.
  db.put('availability',people[1].id,{user_id:people[1].id,from,until,area:'Tuve',activity:'walk'});
  await call('profile_photo',{photo:jpeg},1);
  assert.ok((await call('availability_list',{},2)).some(p=>p.user_id===people[1].id));
  assert.equal((await call('member_photo',{id:people[1].id},2)).photo,jpeg);
  assert.equal((await call('member_profile',{id:people[1].id},2)).email,undefined);
  const offer={peer:people[1].id,activity:'fika',place:'Cafe in Tuve',start:new Date(Date.now()+5*60000).toISOString(),note:'Would you like coffee?',lang:'en'};
  const sent=await call('availability_offer',offer,2);assert.equal(sent.pushChat.owner,people[1].id);
  const inbox=await call('chat_inbox',{},1);assert.equal(inbox[0].availability_offer,true);assert.match(inbox[0].body,/Coffee/);
  await assert.rejects(call('availability_offer',offer,2),{message:'offerPending'});
  await assert.rejects(call('chat_send',{peer:people[1].id,body:'Another message'},2),{message:'forbidden'});
  assert.equal((await call('chat_peer',{peer:people[2].id},1)).canSend,true);
  await call('chat_send',{peer:people[2].id,body:'Yes, thank you'},1);
  assert.equal((await call('chat_peer',{peer:people[1].id},2)).canSend,true);
  await call('chat_send',{peer:people[1].id,body:'Great'},2);
  await call('availability_save',{enabled:false},1);
  await call('chat_send',{peer:people[2].id,body:'See you'},1);
  await call('block_person',{id:people[2].id,enabled:true},1);
  await assert.rejects(call('member_photo',{id:people[1].id},2),{message:'missing'});
  await assert.rejects(call('chat_send',{peer:people[1].id,body:'Blocked'},2),{message:'messageBlocked'});
});

test('suggestions reject stale availability, invalid times, blocked peers and forged contact flags',async()=>{
  const {call,db,people}=await app();
  const row={user_id:people[1].id,area:'Tuve',activity:'walk',from:new Date(Date.now()-60000).toISOString(),until:new Date(Date.now()+30*60000).toISOString()};
  const offer={peer:people[1].id,activity:'walk',place:'Park',start:new Date(Date.now()+5*60000).toISOString()};
  await assert.rejects(call('availability_offer',offer,null),{message:'loginRequired'});
  await assert.rejects(call('availability_offer',offer,2),{message:'missing'});
  db.put('availability',people[1].id,row);
  for(const data of [{...offer,start:row.until},{...offer,start:new Date(Date.now()-1).toISOString()},{...offer,place:''},{...offer,activity:'invalid'}])await assert.rejects(call('availability_offer',data,2),{message:'invalid'});
  await assert.rejects(call('chat_send',{peer:people[1].id,body:'Spoof',availability_offer:true},2),{message:'forbidden'});
  db.put('availability',people[1].id,{...row,until:new Date(Date.now()-1).toISOString()});
  await assert.rejects(call('availability_offer',offer,2),{message:'missing'});
  db.put('availability',people[1].id,row);await call('block_person',{id:people[2].id,enabled:true},1);
  await assert.rejects(call('availability_offer',offer,2),{message:'missing'});
  assert.ok(!(await call('availability_list',{},2)).some(p=>p.user_id===people[1].id));
});

test('Google account deletion needs a recent verified provider session',async()=>{
  const {call,users}=await app();
  users[0].provider='google.com';users[0].authTime=Math.floor(Date.now()/1000)-300;
  await assert.rejects(call('delete_account'),{message:'reauth'});
  users[0].authTime=undefined;
  await assert.rejects(call('delete_account'),{message:'reauth'});
  users[0].authTime=Math.floor(Date.now()/1000);
  const result=await call('delete_account');
  assert.equal(result.deleteAuth,users[0].uid);
});


test('joining company today notifies once, lists private acceptors and enables both sides to chat after expiry',async()=>{
  const {call,db,people}=await app();
  const owner=people[1].id,guest=people[2].id;
  const row={user_id:owner,from:new Date(Date.now()-60000).toISOString(),until:new Date(Date.now()+600000).toISOString(),area:'Tuve',activity:'walk'};
  db.put('availability',owner,row);
  const entry=(await call('availability_list',{},2))[0];
  const result=await call('availability_accept',{peer:owner,version:entry.version,lang:'en'},2);
  assert.equal(result.pushChat.owner,owner);assert.equal(result.pushChat.peer,guest);
  const messages=await db.query('messages');assert.equal(messages.length,1);
  assert.match(messages[0].body,/joined your meetup.*A walk · Tuve/);
  assert.equal(messages[0].availability_accept,true);
  assert.deepEqual(await call('availability_accept',{peer:owner,version:entry.version},2),{});
  assert.equal((await db.query('messages')).length,1);
  const own=(await call('availability_list',{},1))[0];
  assert.deepEqual(own.participants,[{id:guest,name:'waiting'}]);
  const guestView=(await call('availability_list',{},2))[0];assert.equal(guestView.joined,true);assert.deepEqual(guestView.participants,[]);
  assert.doesNotMatch(JSON.stringify(own),/@|email/);
  assert.equal((await call('chat_peer',{peer:owner},2)).canSend,true);
  assert.equal((await call('chat_peer',{peer:guest},1)).canSend,true);
  await call('chat_send',{peer:owner,body:'See you!'},2);
  await call('chat_send',{peer:guest,body:'Welcome!'},1);
  db.remove('availability',owner);
  await call('chat_send',{peer:guest,body:'Keep in touch'},1);
});

test('company acceptance rejects stale, expired, self, blocked and forged membership',async()=>{
  const {call,db,people}=await app();const owner=people[1].id,guest=people[2].id;
  const row={user_id:owner,from:new Date(Date.now()-60000).toISOString(),until:new Date(Date.now()+600000).toISOString(),area:'Tuve',activity:'fika'};
  db.put('availability',owner,row);
  const {version}=(await call('availability_list',{},2))[0];
  await assert.rejects(call('availability_accept',{peer:owner,version:'old'},2),{message:'availabilityChanged'});
  await assert.rejects(call('availability_accept',{peer:owner,version},1),{message:'invalid'});
  await assert.rejects(call('chat_send',{peer:owner,body:'Fake',availability_accept:true},2),{message:'forbidden'});
  db.put('availability',owner,{...row,until:new Date(Date.now()-1).toISOString()});
  await assert.rejects(call('availability_accept',{peer:owner,version},2),{message:'missing'});
  db.put('availability',owner,row);
  await call('availability_accept',{peer:owner,version},2);
  await call('block_person',{id:guest,enabled:true},1);
  await assert.rejects(call('availability_accept',{peer:owner,version},2),{message:'missing'});
  await assert.rejects(call('chat_send',{peer:owner,body:'Blocked'},2));
  assert.deepEqual((await call('availability_list',{},1))[0].participants,[]);
});
