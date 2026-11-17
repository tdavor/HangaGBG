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
  assert.equal((await call("participants",{id}))[0].id,people[1].id);
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
