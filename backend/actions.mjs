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
  const last = (await db.get("settings","sequence"))?.last || 0;
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
    quick:p.quick===true,newcomers:p.newcomers===true};
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
      batches.push({event_id:e.id,kind,name,title:e.title,created:now(),recipients:unique.slice(offset,offset+1000)});
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
      waitlisted:!e.cancelled && !!plan?.waitlisted,placeAvailable:(e.count||0)<e.capacity}];
  }).sort((a,b)=>a.start.localeCompare(b.start)||a.id-b.id);
}

async function messages(db,id) {
  const [sent,received,blocked,blocking] = await Promise.all([
    db.query("messages",[eq("sender",id)],descending,150),
    db.query("messages",[eq("recipient",id)],descending,150),
    db.query("blocks",[eq("blocker",id)]),db.query("blocks",[eq("blocked",id)])
  ]);
  const denied = new Set([...blocked.map(b=>b.blocked),...blocking.map(b=>b.blocker)]);
  const items = [...sent,...received].sort(sortNewest).slice(0,150);
  const people = await db.getMany("profiles",items.flatMap(m=>[m.sender,m.recipient]));
  const events = await db.getMany("events",items.map(m=>m.event_id));
  return items.flatMap(m=>{
    const sender = people.get(String(m.sender));
    const recipient = people.get(String(m.recipient));
    const event = events.get(String(m.event_id));
    if (!sender || !recipient || sender.deleted || recipient.deleted || !event || denied.has(m.sender) || denied.has(m.recipient)) return [];
    return [{...m,title:event.title,sender_name:sender.name,recipient_name:recipient.name}];
  });
}

export const reads = new Set(["events","me","registration","participants","messages","notices","admin","block_list","poll"]);
export async function action(db, name, p, identity, env) {
  if (name==="registration") return {registration:(await db.get("settings","app"))?.registration!==false};
  if (name==="poll") {
    if (!/^[a-f0-9-]{72}$/.test(p.token||"")) fail("forbidden");
    const device = await db.get("devices",await sha(p.token));
    const user = device && await db.get("profiles",device.user_id);
    if (!user || user.blocked || user.deleted || device.expires<=Date.now()) fail("forbidden");
    const after = integer(p.after_id,0);
    const alerts = await db.query("notices",[byRecipient(user.id),["id","GREATER_THAN",after]],ascending,50);
    const events=await db.getMany("events",alerts.map(row=>row.event_id));
    return alerts.map(({id,kind,event_id,title})=>({id,kind:(kind==="cancelled" || events.has(String(event_id)))?kind:"removed",event_id,title}));
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
  if (name==="onboard" || name==="me") return {...publicProfile(me),email:identity.email,admin:me.admin || identity.uid===env.ADMIN_UID};
  if (name==="profile") {
    const profile = {...me,...profileData(p),email:identity.email};
    db.put("profiles",uid,profile);
    return publicProfile(profile);
  }
  if (name==="messages") return messages(db,uid);
  if (name==="notices") {
    const rows=await readNotices(db,uid);
    const events=await db.getMany("events",rows.map(row=>row.event_id));
    return rows.filter(row=>row.kind==="cancelled" || events.has(String(row.event_id))).map(({recipients,...row})=>row);
  }
  if (name==="alerts_on") {
    const cursor = (await db.query("notices",[byRecipient(uid)],descending,1))[0]?.id||0;
    const token = crypto.randomUUID()+crypto.randomUUID();
    const id=await sha(token);
    db.put("devices",id,{id,user_id:uid,expires:Date.now()+30*86400000});
    return {token,cursor};
  }
  if (name==="alerts_off") {
    if (!/^[a-f0-9-]{72}$/.test(p.token||"")) return {};
    const key = await sha(p.token);
    if ((await db.get("devices",key))?.user_id===uid) db.remove("devices",key);
    return {};
  }
  if (name==="admin") {
    if (!me.admin) fail("forbidden");
    const [users,reports,settings] = await Promise.all([db.query("profiles",[],descending),
      db.query("reports",[],descending,200),db.get("settings","app")]);
    return {registration:settings?.registration!==false,users:users.filter(u=>!u.deleted || u.uid).map(u=>u.deleted ? {id:u.id,name:"Pending deletion",blocked:true} : {...publicProfile(u),admin:u.admin || u.uid===env.ADMIN_UID}),reports};
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
      const attended = await db.getMany("events",plans.filter(plan=>plan.joined).map(plan=>plan.event_id));
      for (const plan of plans) {
        const e = attended.get(String(plan.event_id));
        if (e && plan.joined) db.put("events",e.id,{...e,count:Math.max(0,(e.count||0)-1)});
        if (deleting) db.remove("plans",planKey(plan.event_id,target.id));
        else if (plan.joined) db.put("plans",planKey(plan.event_id,target.id),{...plan,joined:false});
      }
    }
    if (deleting) {
      const [sent,received,owned,devices,outgoing,incoming,reportsBy,reportsOn] = await Promise.all([
        db.query("messages",[eq("sender",target.id)]),db.query("messages",[eq("recipient",target.id)]),
        db.query("events",[eq("owner",target.id)]),db.query("devices",[eq("user_id",target.id)]),
        db.query("blocks",[eq("blocker",target.id)]),db.query("blocks",[eq("blocked",target.id)]),
        db.query("reports",[eq("reporter",target.id)]),db.query("reports",[eq("subject",target.id)])
      ]);
      for (const m of [...sent,...received]) db.remove("messages",m.id);
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
    if (p.enabled===true) db.put("blocks",planKey(uid,id),{blocker:uid,blocked:id});
    else db.remove("blocks",planKey(uid,id));
    return {};
  }
  if (name==="create") {
    const data = eventData(p);
    const id = await nextIds(db);
    db.put("events",id,{...data,id,owner:uid,count:0,hidden:false,cancelled:false});
    return {id};
  }
  if (name==="report") return report(db,p,me);
  return eventAction(db,name,p,me);
}

async function report(db,p,me) {
  const reason = text(p.reason,500,1);
  const uid = me.id;
  let subject, context, event_id=null, message_id=null;
  if (p.message!==undefined) {
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
    const waiting=plans.filter(plan=>plan.waitlisted);
    if (name==="participants") {
      const users=await db.getMany("profiles",[e.owner,...joined.map(plan=>plan.user_id)]);
      return [...users.values()].filter(p=>!p.blocked&&!p.deleted).map(({id,name})=>({id,name}))
        .sort((a,b)=>a.name.localeCompare(b.name));
    }
    if (name==="edit") {
      if (e.cancelled) fail("cancelled");
      const data=eventData(p,e);
      if (data.capacity<count) fail("full");
      const alerts=[];
      if (["start","place","area"].some(field=>data[field]!==e[field])) {
        alerts.push(...joined.filter(plan=>plan.user_id!==uid).map(plan=>[plan.user_id,"changed"]));
      }
      if (count>=e.capacity && data.capacity>count && visible && Date.parse(data.start)>Date.now()) {
        alerts.push(...waiting.map(plan=>[plan.user_id,"vacancy"]));
      }
      const updated={...e,...data};
      db.put("events",id,updated);
      await notices(db,updated,alerts);
      return {id};
    }
    if (name==="delete_event") {
      db.remove("events",id);
      if (!e.cancelled && upcoming) {
        await notices(db,e,[...joined,...waiting].filter(plan=>plan.user_id!==uid)
          .map(plan=>[plan.user_id,"cancelled"]));
      }
      return {removedEvent:id};
    }
    if (!e.cancelled) {
      db.put("events",id,{...e,cancelled:true});
      await notices(db,e,[...joined.filter(plan=>plan.user_id!==uid),...waiting].map(plan=>[plan.user_id,"cancelled"]));
    }
    return {};
  }
  if (["join","save","waitlist"].includes(name)) {
    const key=planKey(id,uid);
    const plan=await db.get("plans",key)||{event_id:id,user_id:uid,joined:false,saved:false,waitlisted:false};
    const enabled=p.enabled===true;
    const alerts=[];
    if (enabled && e.cancelled) fail("cancelled");
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
  if (recipient===uid) fail("invalid");
  const [person,blocks]=await Promise.all([db.get("profiles",recipient),
    db.getMany("blocks",[planKey(uid,recipient),planKey(recipient,uid)])]);
  if (!person || person.blocked || person.deleted) fail("missing");
  if (blocks.size) fail("messageBlocked");
  const plans=await db.getMany("plans",[planKey(id,uid),planKey(id,recipient)]);
  const senderJoined=uid===e.owner || plans.get(planKey(id,uid))?.joined;
  const recipientJoined=recipient===e.owner || plans.get(planKey(id,recipient))?.joined;
  if (!visible || !senderJoined || !recipientJoined) fail("forbidden");
  const body=text(p.body,1500,1);
  const msg=await nextIds(db,2);
  db.put("messages",msg,{id:msg,event_id:id,sender:uid,recipient,body,created:now()});
  db.put("notices",msg+1,{id:msg+1,event_id:id,kind:"message",name:me.name,title:e.title,created:now(),recipients:[recipient]});
  return {};
}
