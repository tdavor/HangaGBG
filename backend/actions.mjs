import {availabilityContact} from "./availability-contact.mjs";
import {validatePhoto,profilePhoto,memberMeetups} from "./profile-media.mjs";
import {communityAction,eventExtras,notifyFollowers,weeklyStart,sendDueNotices} from "./community.mjs";
import {socialFields,socialAction,resetPendingProposal,withdrawIdeaMember} from "./social.mjs";
import {friendAction,friendKey,validFriendNotices,sharedMeetup,canReplyToAdmin} from "./friends.mjs";
const eq = (field,value) => [field,"EQUAL",value];
const fail = name => {throw new Error(name);};
const now = () => new Date().toISOString();
const descending = ["id","DESCENDING"];
const ascending = ["id","ASCENDING"];
const sortNewest = (a,b) => b.id-a.id;
const planKey = (event,user) => event+"-"+user;
const text = (value,max,min=0) => {
  const result = typeof value==="string" ? value.trim() : "";
  if ([...result].length>max || [...result].length<min) fail("invalid");
  return result;
};
const integer = (value,min=1,max=Number.MAX_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(value) || value<min || value>max) fail("invalid");
  return value;
};
async function nextIds(db, count=1) {
  const pending=db.writes?.get(db.root+"/settings/sequence")?.update?.fields?.last?.integerValue;
  const last = pending!==undefined?Number(pending):(await db.get("settings","sequence"))?.last || 0;
  db.put("settings","sequence",{last:last+count});
  return last+1;
}
function publicProfile(p) {
  const {uid,deleted,...publicFields} = p;
  return publicFields;
}
function profileData(p) {
  return {name:text(p.name,80,1),area:text(p.area,100),bio:text(p.bio,1500),
    interests:text(p.interests,300),languages:text(p.languages,150)};
}
const normalizedName = name => (name||"").normalize("NFKC").trim().replace(/\s+/gu," ").toLowerCase();

async function requireUniqueName(db, name, current) {
  const key = normalizedName(name);
  if (current && normalizedName(current.name)===key) return;
  // Serialize name claims in the same transaction as the profile write.
  const revision = (await db.get("settings","profile_names"))?.revision || 0;
  const profiles = await db.query("profiles");
  if (profiles.some(profile=>!profile.deleted && profile.id!==current?.id && normalizedName(profile.name)===key)) {
    fail("nameTaken");
  }
  db.put("settings","profile_names",{revision:revision+1});
}
function eventData(p, old) {
  const start = Date.parse(p.start);
  if (!Number.isFinite(start)) fail("invalid");
  if (p.quick===true && (start<=Date.now() || start>Date.now()+86400000)) fail("quickTime");
  if (start<=Date.now() && (!old || Date.parse(old.start)!==start)) fail("past");
  const category = p.category;
  const mood = text(p.mood,12);
  const source = text(p.source,750);
  if (!["fika","food","music","games","sport","walk","nature","culture","nightlife","other"].includes(category)
      || !["","chill","social","active"].includes(mood) || (source && !/^https:\/\/\S+$/.test(source))) fail("invalid");
  return {title:text(p.title,120,1), description:text(p.description,3000),category,mood,
    area:text(p.area,100,1),place:text(p.place,180,1),start:new Date(start).toISOString(),
    price:integer(p.price,0,100000),capacity:integer(p.capacity,1,5000),source,
    quick:p.quick===true,newcomers:p.newcomers===true,...eventExtras(p,old),...socialFields(p,old)};
}
const sha = async input => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(input))),
  byte=>byte.toString(16).padStart(2,"0")).join("");

async function notices(db, e, entries) {
  if (!entries.length) return;
  // One document per event change. Recipients share the same monotonic cursor.
  const byKind = new Map();
  for (const [user,kind,name=""] of entries) {
    if (!byKind.has(kind)) byKind.set(kind,{recipients:[],name});
    byKind.get(kind).recipients.push(user);
  }
  const batches=[];
  for (const [kind,{recipients,name}] of byKind) {
    const unique=[...new Set(recipients)];
    for (let offset=0;offset<unique.length;offset+=1000) {
      batches.push({event_id:e.id,...(e.friendPeer?{peer_id:e.friendPeer}:{}),kind,name,title:e.title,created:now(),recipients:unique.slice(offset,offset+1000)});
    }
  }
  let id = await nextIds(db,batches.length);
  for (const batch of batches) {
    db.put("notices",id,{...batch,id});
    id++;
  }
}
const byRecipient = (uid) => ["recipients","ARRAY_CONTAINS",uid];
const readNotices = (db,uid) => db.query("notices",[byRecipient(uid)],descending,100);

async function eventList(db, me) {
  const id = me?.id;
  const ownPlans = id ? await db.query("plans",[eq("user_id",id)]) : [];
  const plans = new Map(ownPlans.map(row=>[row.event_id,row]));
  const [upcoming,own,withPlan] = await Promise.all([
    me?.admin ? db.query("events") : db.query("events",[["start","GREATER_THAN_OR_EQUAL",now()]]),
    id ? db.query("events",[eq("owner",id)]) : [],
    db.getMany("events",ownPlans.map(plan=>plan.event_id))
  ]);
  const events = [...new Map([...upcoming,...own,...withPlan.values()].map(e=>[e.id,e])).values()];
  const owners = await db.getMany("profiles",events.map(e=>e.owner));
  return events.flatMap(e=>{
    const owner = owners.get(String(e.owner));
    const plan = plans.get(e.id);
    const personal = me?.admin || e.owner===id;
    if (!owner || owner.deleted || (!personal && (e.hidden || owner.blocked)) ||
        (!personal && e.cancelled && !plan?.joined && !plan?.saved && !plan?.waitlisted)) return [];
    return [{...e,organizer:owner.name,count:e.count||0,joined:!!plan?.joined,saved:!!(plan?.saved || (e.cancelled && plan?.waitlisted)),
      interested:!!plan?.interested,proposalConfirmed:e.owner===id?!!e.ownerConfirmed:!!plan?.proposalConfirmed,
      confirmed:plan?.confirmedStart===e.start,waitlisted:!e.cancelled && !!plan?.waitlisted,placeAvailable:(e.count||0)<e.capacity}];
  }).sort((a,b)=>a.start.localeCompare(b.start)||a.id-b.id);
}

async function messages(db,id,chat=false) {
  const [sent,received,blocked,blocking,deleted,hidden] = await Promise.all([
    db.query("messages",[eq("sender",id)],descending,chat?undefined:150),
    db.query("messages",[eq("recipient",id)],descending,chat?undefined:150),
    db.query("blocks",[eq("blocker",id)]),db.query("blocks",[eq("blocked",id)]),
    db.query("chat_reads",[eq("owner",id)]),db.query("chat_hidden",[eq("owner",id)])
  ]);
  const denied = new Set([...blocked.map(b=>b.blocked),...blocking.map(b=>b.blocker)]);
  const cutoffs=new Map(deleted.map(row=>[row.peer,row.deletedThrough||0]));
  const hiddenIds=new Set(hidden.map(row=>row.message_id));
  const sorted = [...sent,...received].filter(m=>m.id>(cutoffs.get(m.sender===id?m.recipient:m.sender)||0)&&!hiddenIds.has(m.id)).sort(sortNewest);
  const items = chat?sorted:sorted.slice(0,150);
  const people = await db.getMany("profiles",items.flatMap(m=>[m.sender,m.recipient]));
  const events = await db.getMany("events",items.map(m=>m.event_id));
  return items.flatMap(m=>{
    const sender = people.get(String(m.sender));
    const recipient = people.get(String(m.recipient));
    const event = events.get(String(m.event_id));
    if (!sender || !recipient || sender.deleted || recipient.deleted || (chat && (sender.blocked || recipient.blocked)) || denied.has(m.sender) || denied.has(m.recipient)) return [];
    return [{...m,...(m.invite_event?{invite_available:!!event&&!event.hidden&&!event.cancelled}:{}),title:m.title||event?.title||"",sender_name:sender.name,recipient_name:recipient.name}];
  });
}

export const reads = new Set(["events","me","registration","participants","messages","notices","admin","block_list","poll","member_profile","member_photo","chat_inbox","availability_list","follow_list","group_messages","feedback_get","again_list","friend_list","friend_status","chat_peer"]);
export async function action(db, name, p, identity, env) {
  if(name==="due_notices") {if(identity!==null) fail("forbidden");await sendDueNotices(db,notices,integer(p.id));return {};}
  if (name==="registration") return {registration:(await db.get("settings","app"))?.registration!==false};
  if (name==="poll") {
    if (!/^[a-f0-9-]{72}$/.test(p.token||"")) fail("forbidden");
    const device = await db.get("devices",await sha(p.token));
    const user = device && await db.get("profiles",device.user_id);
    if (!user || user.blocked || user.deleted || device.expires<=Date.now()) fail("forbidden");
    const after = integer(p.after_id,0);
    const alerts = await db.query("notices",[byRecipient(user.id),["id","GREATER_THAN",after]],ascending,50);
    const events=await db.getMany("events",alerts.map(row=>row.event_id));
    const legacy=await db.getMany("messages",alerts.filter(a=>a.kind==="message").map(a=>a.message_id||a.id-1));
    const senders=[...new Set(alerts.filter(a=>a.kind==="message").map(a=>a.sender_id||legacy.get(String(a.message_id||a.id-1))?.sender).filter(Boolean))];
    const [people,blocks]=await Promise.all([
      db.getMany("profiles",senders),db.getMany("blocks",senders.flatMap(sender=>[planKey(user.id,sender),planKey(sender,user.id)]))
    ]);
    const visibleMessages=new Set((await messages(db,user.id,true)).map(m=>m.id));
    const friendNotices=await validFriendNotices(db,user.id,alerts);
    return alerts.map(({id,kind,event_id,title,sender_id,message_id,peer_id})=>{
      if(["friendRequest","friendAccepted"].includes(kind)) return {id,kind:friendNotices.has(id)?kind:"message_skipped",event_id:0,title,peer_id};
      if (kind==="message") {
        const sender=sender_id||legacy.get(String(message_id||id-1))?.sender;
        const profile=people.get(String(sender));
        if (visibleMessages.has(message_id||id-1) && profile && !profile.deleted && !profile.blocked && !blocks.has(planKey(user.id,sender)) && !blocks.has(planKey(sender,user.id))) {
          return {id,kind,event_id,title:profile.name,sender_id:sender};
        }
        return {id,kind:"message_skipped",event_id,title};
      }
      return {id,kind:(kind==="cancelled" || events.has(String(event_id)))?kind:"removed",event_id,title};
    });
  }
  const link = identity && await db.get("identities",identity.uid);
  const me = link && await db.get("profiles",link.id);
  if (name==="events") return eventList(db,identity?.verified && me && !me.blocked && !me.deleted
    ? {...me,admin:me.admin || identity.uid===env.ADMIN_UID} : null);
  if (!identity) fail("loginRequired");
  if (!identity.verified && name!=="onboard") fail("confirmEmail");
  if (name==="onboard" && !link) {
    if (p.adult!==true) fail("adult");
    if ((await db.get("settings","app"))?.registration===false) fail("closed");
    const data = profileData(p);
    await requireUniqueName(db,data.name);
    const id = await nextIds(db);
    const profile = {...data,id,uid:identity.uid,email:identity.email,admin:identity.uid===env.ADMIN_UID,blocked:false};
    db.put("identities",identity.uid,{id});
    db.put("profiles",id,profile);
    return {...publicProfile(profile),newRegistration:true};
  }
  if (me?.deleted && me.uid===identity.uid && name==="delete_account" &&
      identity.provider==="password" && Date.now()/1000-identity.authTime<=120) {
    return {deleteAuth:me.uid,profileId:me.id};
  }
  if (!me || me.deleted) fail("loginRequired");
  if (me.blocked) fail("blocked");
  me.admin = me.admin || identity.uid===env.ADMIN_UID;
  const uid = me.id;
  if (name==="onboard" || name==="me") return {...publicProfile(me),photo:await profilePhoto(db,uid),email:identity.email,admin:me.admin || identity.uid===env.ADMIN_UID};
  if(name==="profile_photo") {
    const photo=validatePhoto(p.photo);
    if(photo)db.put("profile_photos",uid,{data:photo});else db.remove("profile_photos",uid);
    return {photo};
  }
  if (name==="profile") {
    const data = profileData({...p,languages:p.languages??me.languages});
    await requireUniqueName(db,data.name,me);
    const profile = {...me,...data,email:identity.email};
    db.put("profiles",uid,profile);
    return {...publicProfile(profile),photo:await profilePhoto(db,uid)};
  }
  const community=await communityAction(db,name,p,me,{text,integer,nextIds,notices,writeMessage});
  if(community!==null) return community;
  const friend=await friendAction(db,name,p,me,{integer,notices,writeMessage,env});
  if(friend!==null) return friend;
  const social=await socialAction(db,name,p,me,{integer,notices});
  if(social!==null) return social;
  if(name==="member_photo") {
    const id=integer(p.id),person=await db.get("profiles",id);
    if(!person||person.deleted||person.blocked||await db.get("blocks",planKey(uid,id))||await db.get("blocks",planKey(id,uid)))fail("missing");
    return {photo:await profilePhoto(db,id)};
  }
  if (name==="member_profile") {
    const id=integer(p.id);
    const [member,outgoing,incoming]=await Promise.all([
      db.get("profiles",id),db.get("blocks",planKey(uid,id)),db.get("blocks",planKey(id,uid))
    ]);
    if (!member || member.deleted || member.blocked || outgoing || incoming) fail("missing");
    const [photo,meetups,contact]=await Promise.all([profilePhoto(db,id),memberMeetups(db,id,uid),
      id===uid?null:friendAction(db,"chat_peer",{peer:id},me,{integer,notices,writeMessage,env})]);
    return {id,name:member.name,bio:member.bio||"",languages:member.languages||"",photo,meetups,
      canMessage:!!contact?.canSend,following:!!await db.get("follows",planKey(uid,id))};
  }
  if (name==="messages") return messages(db,uid);
  if (name==="chat_inbox") {
    const rows=await messages(db,uid,true);
    const peers=[...new Set(rows.map(m=>m.sender===uid?m.recipient:m.sender))];
    const seen=await db.getMany("chat_reads",peers.map(peer=>planKey(uid,peer)));
    return rows.map(m=>({...m,unread:m.recipient===uid && m.id>(seen.get(planKey(uid,m.sender))?.through||0)}));
  }
  if (name==="chat_read") {
    const peer=integer(p.peer);
    const through=integer(p.through);
    const message=await db.get("messages",through);
    if (!message || message.sender!==peer || message.recipient!==uid) fail("missing");
    const key=planKey(uid,peer);
    const existing=await db.get("chat_reads",key);
    if ((existing?.through||0)<through) db.put("chat_reads",key,{...existing,owner:uid,peer,through});
    return {};
  }
  if(name==="chat_delete") {
    const peer=integer(p.peer);
    const id=integer(p.message??p.through);
    const message=await db.get("messages",id);
    if(!message||!((message.sender===uid&&message.recipient===peer)||(message.sender===peer&&message.recipient===uid))) fail("missing");
    if(p.message!==undefined) db.put("chat_hidden",planKey(uid,id),{owner:uid,peer,message_id:id});
    else {
      const key=planKey(uid,peer),existing=await db.get("chat_reads",key);
      db.put("chat_reads",key,{...existing,owner:uid,peer,through:Math.max(existing?.through||0,id),deletedThrough:Math.max(existing?.deletedThrough||0,id)});
    }
    return {};
  }
  if (name==="chat_send") {
    const peer=integer(p.peer);
    await messagingPeer(db,uid,peer);
    if(me.admin) return writeMessage(db,me,peer,0,"Hänga Gbg",p.body,{admin_message:true});
    if(await canReplyToAdmin(db,uid,peer,env)) return writeMessage(db,me,peer,0,"Hänga Gbg",p.body);
    if(await availabilityContact(db,uid,peer))return writeMessage(db,me,peer,0,"Hänga Gbg",p.body);
    if((await db.get("friendships",friendKey(uid,peer)))?.status==="accepted") return writeMessage(db,me,peer,0,"Hänga Gbg",p.body);
    const [sent,received]=await Promise.all([
      db.query("messages",[eq("sender",uid),eq("recipient",peer)]),
      db.query("messages",[eq("sender",peer),eq("recipient",uid)])
    ]);
    const eventIds=new Set([...sent,...received].sort(sortNewest).map(m=>m.event_id).filter(id=>Number.isSafeInteger(id)&&id>0));
    for (const id of eventIds) {
      try { return await eventAction(db,"message",{id,recipient:peer,body:p.body},me); }
      catch (error) { if (!["forbidden","missing","cancelled"].includes(error.message)) throw error; }
    }
    const shared=await sharedMeetup(db,uid,peer);
    if(shared) return eventAction(db,"message",{id:shared.id,recipient:peer,body:p.body},me);
    fail("forbidden");
  }
  if (name==="notices") {
    const rows=await readNotices(db,uid);
    const visibleMessages=new Set((await messages(db,uid,true)).map(m=>m.id));
    const friendNotices=await validFriendNotices(db,uid,rows);
    const events=await db.getMany("events",rows.map(row=>row.event_id));
    return rows.filter(row=>["friendRequest","friendAccepted"].includes(row.kind)?friendNotices.has(row.id):row.kind==="message"?visibleMessages.has(row.message_id||row.id-1):row.kind==="cancelled" || events.has(String(row.event_id))).map(({recipients,...row})=>row);
  }
  if (name==="alerts_on") {
    const cursor = (await db.query("notices",[byRecipient(uid)],descending,1))[0]?.id||0;
    const token = crypto.randomUUID()+crypto.randomUUID();
    const id=await sha(token);
    db.put("devices",id,{id,user_id:uid,expires:Date.now()+30*86400000});
    return {token,cursor};
  }
  if (name==="push_register") {
    if (typeof p.deviceToken!=="string" || !/^[a-f0-9-]{72}$/.test(p.deviceToken)
        || typeof p.fcmToken!=="string" || !/^[A-Za-z0-9:_-]{20,4096}$/.test(p.fcmToken)) fail("invalid");
    const key=await sha(p.deviceToken);
    const device=await db.get("devices",key);
    if (!device || device.user_id!==uid || device.expires<=Date.now()) fail("missing");
    if (device.fcmToken!==p.fcmToken) db.put("devices",key,{...device,fcmToken:p.fcmToken});
    return {};
  }
  if (name==="alerts_off") {
    if (!/^[a-f0-9-]{72}$/.test(p.token||"")) return {};
    const key = await sha(p.token);
    if ((await db.get("devices",key))?.user_id===uid) db.remove("devices",key);
    return {};
  }
  if (name==="admin") {
    if (!me.admin) fail("forbidden");
    const [users,reports,settings,feedback] = await Promise.all([db.query("profiles",[],descending),
      db.query("reports",[],descending,200),db.get("settings","app"),db.query("feedback",[],["created","DESCENDING"],100)]);
    return {registration:settings?.registration!==false,users:users.filter(u=>!u.deleted || u.uid).map(u=>u.deleted ? {id:u.id,name:"Pending deletion",blocked:true} : {...publicProfile(u),admin:u.admin || u.uid===env.ADMIN_UID}),reports,feedback};
  }
  if (name==="admin_settings" || name==="resolve_report") {
    if (!me.admin) fail("forbidden");
    if (name==="admin_settings") db.put("settings","app",{registration:p.registration===true});
    else {
      const report = await db.get("reports",integer(p.id));
      if (report) db.put("reports",report.id,{...report,resolved:true});
    }
    return {};
  }
  if (["delete_account","admin_delete","admin_block"].includes(name)) {
    if (name!=="delete_account" && !me.admin) fail("forbidden");
    if (name==="delete_account" && (identity.provider!=="password" || Date.now()/1000-identity.authTime>120)) fail("reauth");
    const target = name==="delete_account" ? me : await db.get("profiles",integer(p.id));
    if (!target || (name!=="delete_account" && (target.id===uid || target.uid===env.ADMIN_UID))) fail("forbidden");
    if (target.deleted) {
      if (name==="admin_delete" && target.uid) return {deleteAuth:target.uid,profileId:target.id};
      fail("forbidden");
    }
    const deleting = name!=="admin_block";
    const blocked = deleting || p.blocked===true;
    if (blocked) {
      const plans = await db.query("plans",[eq("user_id",target.id)]);
      const attended = await db.getMany("events",plans.filter(plan=>plan.joined||plan.interested).map(plan=>plan.event_id));
      for (const plan of plans) {
        const e = attended.get(String(plan.event_id));
        if(e&&plan.interested&&e.minPeople&&e.proposalPhase!=="active") await withdrawIdeaMember(db,e,target.id);
        if (e && plan.joined) db.put("events",e.id,{...e,count:Math.max(0,(e.count||0)-1)});
        if (deleting) db.remove("plans",planKey(plan.event_id,target.id));
        else if (plan.joined||plan.interested) db.put("plans",planKey(plan.event_id,target.id),{...plan,joined:false,interested:false,proposalConfirmed:false});
      }
    }
    if (deleting) {
      const [sent,received,owned,devices,outgoing,incoming,reportsBy,reportsOn,readBy,readAbout] = await Promise.all([
        db.query("messages",[eq("sender",target.id)]),db.query("messages",[eq("recipient",target.id)]),
        db.query("events",[eq("owner",target.id)]),db.query("devices",[eq("user_id",target.id)]),
        db.query("blocks",[eq("blocker",target.id)]),db.query("blocks",[eq("blocked",target.id)]),
        db.query("reports",[eq("reporter",target.id)]),db.query("reports",[eq("subject",target.id)]),
        db.query("chat_reads",[eq("owner",target.id)]),db.query("chat_reads",[eq("peer",target.id)])
      ]);
      const additional=await Promise.all([
        db.query("follows",[eq("follower",target.id)]),db.query("follows",[eq("organizer",target.id)]),
        db.query("feedback",[eq("user_id",target.id)]),db.query("group_messages",[eq("sender",target.id)]),
        db.query("chat_hidden",[eq("owner",target.id)]),db.query("chat_hidden",[eq("peer",target.id)]),
        db.query("again_choices",[eq("user_id",target.id)]),db.query("again_choices",[eq("target",target.id)]),
        db.query("again_matches",[["users","ARRAY_CONTAINS",target.id]]),db.query("again_pairs",[["users","ARRAY_CONTAINS",target.id]]),db.query("friendships",[["users","ARRAY_CONTAINS",target.id]])
      ]);
      db.remove("availability",target.id);
      db.remove("profile_photos",target.id);
      for(const row of [...additional[0],...additional[1]]) db.remove("follows",planKey(row.follower,row.organizer));
      for(const row of additional[2]) db.remove("feedback",planKey(row.event_id,row.user_id));
      for(const row of additional[3]) db.remove("group_messages",row.id);
      for(const row of [...additional[4],...additional[5]]) db.remove("chat_hidden",planKey(row.owner,row.message_id));
      for(const row of [...additional[6],...additional[7]]) db.remove("again_choices",row.id);
      for(const row of additional[8]) db.remove("again_matches",row.id);
      for(const row of additional[9]) db.remove("again_pairs",row.id);
      for(const row of additional[10]) db.remove("friendships",row.id);
      for (const m of [...sent,...received]) db.remove("messages",m.id);
      for (const marker of [...readBy,...readAbout]) db.remove("chat_reads",planKey(marker.owner,marker.peer));
      for (const e of owned) db.remove("events",e.id);
      for (const device of devices) if (device.id) db.remove("devices",device.id);
      for (const b of [...outgoing,...incoming]) db.remove("blocks",planKey(b.blocker,b.blocked));
      const reports = new Map([...reportsBy,...reportsOn].map(r=>[r.id,r]));
      for (const r of reports.values()) db.put("reports",r.id,{...r,
        reporter:r.reporter===target.id?null:r.reporter,subject:r.subject===target.id?null:r.subject,
        context:""});
      db.put("profiles",target.id,{id:target.id,uid:target.uid,blocked:true,deleted:true});
    } else db.put("profiles",target.id,{...target,blocked});
    return deleting ? {deleteAuth:target.uid,profileId:target.id} : {};
  }
  if (name==="block_list") {
    const blocked = await db.query("blocks",[eq("blocker",uid)]);
    const people = await db.getMany("profiles",blocked.map(b=>b.blocked));
    return [...people.values()].filter(p=>!p.deleted).map(({id,name})=>({id,name})).sort((a,b)=>a.name.localeCompare(b.name));
  }
  if (name==="block_person") {
    const id = integer(p.id);
    if (id===uid) fail("invalid");
    if (!(await db.get("profiles",id))?.name) fail("missing");
    if (p.enabled===true) {db.put("blocks",planKey(uid,id),{blocker:uid,blocked:id});db.remove("friendships",friendKey(uid,id));}
    else db.remove("blocks",planKey(uid,id));
    return {};
  }
  if (name==="create") {
    const data = eventData(p);
    const repeat=integer(p.repeatCount??1,1,12);
    if((data.quick||data.minPeople>0)&&repeat>1) fail("invalid");
    const first=await nextIds(db,repeat);
    const duration=Date.parse(data.end)-Date.parse(data.start);
    for(let index=0;index<repeat;index++) {
      const start=weeklyStart(data.start,index);
      const event={...data,id:first+index,owner:uid,count:0,hidden:false,cancelled:false,start,
        end:new Date(Date.parse(start)+duration).toISOString(),...(data.minPeople?{proposalPhase:"collecting",interestCount:0,ownerConfirmed:false}:{}),series:repeat>1?first:null};
      db.put("events",event.id,event);
      if(index===0) await notifyFollowers(db,event,notices);
    }
    return {id:first};
  }
  if (name==="report") return report(db,p,me);
  return eventAction(db,name,p,me);
}

async function report(db,p,me) {
  const reason = text(p.reason,500,1);
  const uid = me.id;
  let subject, context, event_id=null, message_id=null;
  if(p.group!==undefined) {
    message_id=integer(p.group);
    const m=await db.get("group_messages",message_id);
    const event=m&&await db.get("events",m.event_id);
    const plan=event&&await db.get("plans",planKey(event.id,uid));
    if(!event||!(event.owner===uid||plan?.joined)) fail("missing");
    subject=m.sender;context=m.body.slice(0,500);event_id=event.id;
  } else if (p.message!==undefined) {
    message_id=integer(p.message);
    const m=await db.get("messages",message_id);
    if (!m || ![m.sender,m.recipient].includes(uid)) fail("missing");
    subject=m.sender===uid?m.recipient:m.sender;
    context=m.body.slice(0,500);
    event_id=m.event_id;
  } else if (p.id!==undefined) {
    event_id=integer(p.id);
    const event=await db.get("events",event_id);
    const owner=event && await db.get("profiles",event.owner);
    if (!owner || owner.deleted || ((!me.admin && (event.hidden || owner.blocked)))) fail("missing");
    subject=event.owner;
    context=event.title;
  } else {
    subject=integer(p.person);
    const person=await db.get("profiles",subject);
    if (!person || person.deleted) fail("missing");
    context=person.name;
  }
  if (uid===subject) fail("invalid");
  const prior=await db.query("reports",[eq("reporter",uid)]);
  if (prior.some(r=>!r.resolved && r.subject===subject && r.event_id===event_id && r.message_id===message_id)) fail("reported");
  const id=await nextIds(db);
  db.put("reports",id,{id,reporter:uid,subject,context,event_id,message_id,reason,resolved:false,created:now()});
  return {};
}

async function eventAction(db,name,p,me) {
  const id=integer(p.id);
  const e=await db.get("events",id);
  const uid=me.id;
  const owner=e && await db.get("profiles",e.owner);
  if (!owner || owner.deleted) fail("missing");
  const visible=!e.hidden && !owner.blocked;
  const manager=me.admin || e.owner===uid;
  const upcoming=Date.parse(e.start)>Date.now();
  const count=e.count||0;
  if (!visible && !manager) fail("missing");
  if (["edit","participants","cancel","delete_event","moderate"].includes(name)) {
    const participant = name==="participants" && visible && !e.cancelled &&
      (await db.get("plans",planKey(id,uid)))?.joined;
    if ((!manager && !participant) || (name==="moderate" && !me.admin)) fail("forbidden");
    if (name==="moderate") {
      db.put("events",id,{...e,hidden:p.hidden===true});
      return {};
    }
    const plans=await db.query("plans",[eq("event_id",id)]);
    const joined=plans.filter(plan=>plan.joined);
    const subscribers=plans.filter(plan=>plan.joined||plan.interested);
    const waiting=plans.filter(plan=>plan.waitlisted);
    if (name==="participants") {
      const users=await db.getMany("profiles",[e.owner,...joined.map(plan=>plan.user_id)]);
      return [...users.values()].filter(p=>!p.blocked&&!p.deleted).map(({id,name})=>({id,name}))
        .sort((a,b)=>a.name.localeCompare(b.name));
    }
    if (name==="edit") {
      if (e.cancelled) fail("cancelled");
      const data=eventData(p,e);
      if (data.capacity<count || (e.minPeople&&e.proposalPhase!=="active"&&data.capacity<plans.filter(plan=>plan.interested).length)) fail("full");
      const alerts=[];
      if (["start","place","area","meetingMap","meetingNote"].some(field=>data[field]!==e[field])) {
        alerts.push(...subscribers.filter(plan=>plan.user_id!==uid).map(plan=>[plan.user_id,"changed"]));
      }
      if (count>=e.capacity && data.capacity>count && visible && Date.parse(data.start)>Date.now()) {
        alerts.push(...waiting.map(plan=>[plan.user_id,"vacancy"]));
      }
      const updated=await resetPendingProposal(db,e,{...e,...data},plans);
      db.put("events",id,updated);
      await notices(db,updated,alerts);
      return {id};
    }
    if (name==="delete_event") {
      db.remove("events",id);
      if (!e.cancelled && upcoming) {
        await notices(db,e,[...subscribers,...waiting].filter(plan=>plan.user_id!==uid)
          .map(plan=>[plan.user_id,"cancelled"]));
      }
      return {removedEvent:id};
    }
    if (!e.cancelled) {
      db.put("events",id,{...e,cancelled:true});
      await notices(db,e,[...subscribers.filter(plan=>plan.user_id!==uid),...waiting].map(plan=>[plan.user_id,"cancelled"]));
    }
    return {};
  }
  if (["join","save","waitlist"].includes(name)) {
    const key=planKey(id,uid);
    const plan=await db.get("plans",key)||{event_id:id,user_id:uid,joined:false,saved:false,waitlisted:false};
    const enabled=p.enabled===true;
    const alerts=[];
    if (enabled && e.cancelled) fail("cancelled");
    if(["join","waitlist"].includes(name)&&enabled&&e.minPeople&&e.proposalPhase!=="active") fail("forbidden");
    if (name==="join" && enabled!==plan.joined) {
      if (enabled) {
        if (!visible || !upcoming) fail("past");
        if (count>=e.capacity) fail("full");
        plan.waitlisted=false;
        if (uid!==e.owner) alerts.push([e.owner,"joined",me.name]);
      } else if (count>=e.capacity && !e.cancelled && visible && upcoming) {
        const waiting=await db.query("plans",[eq("event_id",id),eq("waitlisted",true)]);
        alerts.push(...waiting.map(p=>[p.user_id,"vacancy"]));
      }
      plan.joined=enabled;
      db.put("events",id,{...e,count:Math.max(0,count+(enabled?1:-1))});
    } else if (name==="save") {
      plan.saved=enabled;
      if (e.cancelled && !enabled) plan.waitlisted=false;
    } else if (name==="waitlist") {
      if (enabled && (!visible || !upcoming)) fail("missing");
      if (enabled && count<e.capacity) fail("seatAvailable");
      plan.waitlisted=enabled&&!plan.joined;
    }
    if (plan.joined || plan.saved || plan.waitlisted) db.put("plans",key,plan);
    else db.remove("plans",key);
    await notices(db,e,alerts);
    return {};
  }
  if (name!=="message") fail("missing");
  if (e.cancelled) fail("cancelled");
  const recipient=integer(p.recipient);
  await messagingPeer(db,uid,recipient);
  const plans=await db.getMany("plans",[planKey(id,uid),planKey(id,recipient)]);
  const senderJoined=uid===e.owner || plans.get(planKey(id,uid))?.joined;
  const recipientJoined=recipient===e.owner || plans.get(planKey(id,recipient))?.joined;
  if (!visible || !senderJoined || !recipientJoined) fail("forbidden");
  return writeMessage(db,me,recipient,id,e.title,p.body);
}

async function messagingPeer(db,uid,recipient) {
  if (recipient===uid) fail("invalid");
  const [person,blocks]=await Promise.all([db.get("profiles",recipient),
    db.getMany("blocks",[planKey(uid,recipient),planKey(recipient,uid)])]);
  if (!person || person.blocked || person.deleted) fail("missing");
  if (blocks.size) fail("messageBlocked");
}

async function writeMessage(db,me,recipient,event_id,title,value,metadata={}) {
  const body=text(value,1500,1);
  const msg=await nextIds(db,2);
  const created=now();
  db.put("messages",msg,{...metadata,id:msg,event_id,title,sender:me.id,recipient,body,created});
  db.put("notices",msg+1,{id:msg+1,event_id,message_id:msg,kind:"message",sender_id:me.id,name:me.name,title:title||me.name,created,recipients:[recipient]});
  return {pushChat:{owner:recipient,peer:me.id,notice:msg+1}};
}
