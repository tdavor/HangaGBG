const eq=(field,value)=>[field,"EQUAL",value];
const fail=message=>{throw new Error(message);};
const key=(a,b)=>a+"-"+b;
const clock=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Stockholm",year:"numeric",month:"2-digit",day:"2-digit",
  hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
const local=ms=>clock.format(new Date(ms)).replace(" ","T");

export function localInstant(value) {
  const target=Date.parse(value+"Z");
  if (!Number.isFinite(target)) fail("invalid");
  let ms=target;
  for(let i=0;i<3;i++) ms+=target-Date.parse(local(ms)+"Z");
  if(local(ms)!==value) fail("invalid");
  return ms;
}
export function weeklyStart(start,weeks) {
  const value=new Date(Date.parse(local(Date.parse(start))+"Z")+weeks*7*86400000).toISOString().slice(0,19);
  return new Date(localInstant(value)).toISOString();
}
const until=e=>Date.parse(e.end||e.start);
export function eventExtras(p,old) {
  const meetingNote=typeof p.meetingNote==="string"?p.meetingNote.trim():old?.meetingNote||"";
  const meetingMap=typeof p.meetingMap==="string"?p.meetingMap.trim():old?.meetingMap||"";
  if(meetingNote.length>400 || meetingMap.length>750) fail("invalid");
  if(meetingMap) {
    let url;try{url=new URL(meetingMap);}catch{fail("invalid");}
    if(url.protocol!=="https:" || url.username || url.password ||
       !["maps.google.com","www.google.com","maps.app.goo.gl"].includes(url.hostname)) fail("invalid");
  }
  const duration=old?.end?Date.parse(old.end)-Date.parse(old.start):2*3600000;
  const end=p.end?new Date(p.end):new Date(Date.parse(p.start)+duration);
  if(!Number.isFinite(end.getTime()) || end<=new Date(p.start) || end-new Date(p.start)>7*86400000) fail("invalid");
  return {meetingNote,meetingMap,end:end.toISOString()};
}
async function allowedMember(db,me,id) {
  const person=await db.get("profiles",id);
  if(!person||person.deleted||person.blocked||await db.get("blocks",key(me.id,id))||await db.get("blocks",key(id,me.id))) fail("missing");
  return person;
}
export async function communityAction(db,name,p,me,{text,integer,nextIds,notices}) {
  const uid=me.id;
  if(name==="availability_list") {
    const rows=await db.query("availability",[["until","GREATER_THAN",new Date().toISOString()]]);
    const people=await db.getMany("profiles",rows.map(row=>row.user_id));
    const blocks=await db.query("blocks");
    return rows.filter(row=>{
      const person=people.get(String(row.user_id));
      return person&&!person.deleted&&!person.blocked&&!blocks.some(b=>(b.blocker===uid&&b.blocked===row.user_id)||(b.blocker===row.user_id&&b.blocked===uid));
    }).map(row=>({...row,name:people.get(String(row.user_id)).name})).sort((a,b)=>a.from.localeCompare(b.from));
  }
  if(name==="availability_save") {
    if(p.enabled===false){db.remove("availability",uid);return {};}
    const from=Date.parse(p.from), to=Date.parse(p.until);
    const tomorrow=new Date(Date.parse(local(Date.now()).slice(0,10)+"T00:00:00Z")+86400000).toISOString().slice(0,10);
    const midnight=localInstant(tomorrow+"T00:00:00");
    if(!Number.isFinite(from)||!Number.isFinite(to)||to<=Date.now()||to<=from||local(from).slice(0,10)!==local(Date.now()).slice(0,10)||from>=midnight||to>midnight) fail("invalid");
    if(!["fika","walk","other"].includes(p.activity)) fail("invalid");
    db.put("availability",uid,{user_id:uid,area:text(p.area,100,1),activity:p.activity,from:new Date(from).toISOString(),until:new Date(to).toISOString()});
    return {};
  }
  if(name==="follow_list") {
    const rows=await db.query("follows",[eq("follower",uid)]);
    const people=await db.getMany("profiles",rows.map(row=>row.organizer));
    const blocks=await db.query("blocks");
    return [...people.values()].filter(p=>!p.deleted&&!p.blocked&&!blocks.some(b=>
      (b.blocker===uid&&b.blocked===p.id)||(b.blocked===uid&&b.blocker===p.id))).map(p=>({id:p.id,name:p.name}));
  }
  if(name==="follow_change") {
    const id=integer(p.id);if(id===uid) fail("invalid");
    await allowedMember(db,me,id);
    if(p.enabled) db.put("follows",key(uid,id),{follower:uid,organizer:id});
    else db.remove("follows",key(uid,id));
    return {};
  }
  if(!["group_messages","group_send","attendance","feedback_get","feedback_save"].includes(name)) return null;
  const id=integer(p.id), event=await db.get("events",id);
  if(!event) fail("missing");
  const plan=await db.get("plans",key(id,uid));
  const member=event.owner===uid||plan?.joined;
  if(!member) fail("forbidden");
  await allowedMember(db,me,event.owner);
  if(event.hidden||event.cancelled) fail("missing");
  if(name==="attendance") {
    if(!plan?.joined||Date.parse(event.start)<=Date.now()||Date.parse(event.start)-Date.now()>86400000) fail("invalid");
    db.put("plans",key(id,uid),{...plan,confirmedAt:new Date().toISOString(),confirmedStart:event.start});
    return {};
  }
  if(name==="feedback_get"||name==="feedback_save") {
    if(until(event)>Date.now()) fail("past");
    if(name==="feedback_get") return await db.get("feedback",key(id,uid))||{};
    if(!["yes","partly","no"].includes(p.welcome)||!["yes","maybe","no"].includes(p.again)) fail("invalid");
    db.put("feedback",key(id,uid),{event_id:id,user_id:uid,welcome:p.welcome,again:p.again,note:text(p.note,1500),created:new Date().toISOString()});
    return {};
  }
  const blocked=await db.query("blocks");
  const denied=new Set(blocked.filter(b=>b.blocker===uid||b.blocked===uid).map(b=>b.blocker===uid?b.blocked:b.blocker));
  if(name==="group_messages") {
    const rows=(await db.query("group_messages",[eq("event_id",id)])).sort((a,b)=>b.id-a.id).slice(0,200);
    const people=await db.getMany("profiles",rows.map(row=>row.sender));
    return rows.filter(row=>!denied.has(row.sender)&&people.get(String(row.sender))&&!people.get(String(row.sender)).deleted&&!people.get(String(row.sender)).blocked)
      .map(row=>({...row,name:people.get(String(row.sender)).name})).reverse();
  }
  const msg=await nextIds(db);
  db.put("group_messages",msg,{id:msg,event_id:id,sender:uid,body:text(p.body,1500,1),created:new Date().toISOString()});
  const plans=await db.query("plans",[eq("event_id",id)]);
  await notices(db,event,[...new Set([event.owner,...plans.filter(p=>p.joined).map(p=>p.user_id)])]
    .filter(id=>id!==uid&&!denied.has(id)).map(id=>[id,"group",me.name]));
  return {};
}

export async function notifyFollowers(db,event,notices) {
  const followers=await db.query("follows",[eq("organizer",event.owner)]);
  const people=await db.getMany("profiles",followers.map(row=>row.follower));
  const blocks=await db.query("blocks");
  await notices(db,event,followers.filter(row=>{
    const person=people.get(String(row.follower));
    return person&&!person.blocked&&!person.deleted&&!blocks.some(b=>
      (b.blocker===event.owner&&b.blocked===row.follower)||(b.blocker===row.follower&&b.blocked===event.owner));
  }).map(row=>[row.follower,"following"]));
}

export function duePrompt(event) {
  if(event.cancelled||event.hidden||(event.minPeople&&event.proposalPhase!=="active")) return null;
  const remaining=Date.parse(event.start)-Date.now();
  const kind=remaining>0&&remaining<=86400000?"attendance":until(event)<=Date.now()&&Date.now()-until(event)<7*86400000?"feedback":"";
  return kind?{kind,marker:key(event.id,kind)+"-"+Date.parse(event.start)}:null;
}

export async function pendingPrompts(db,events) {
  const due=events.map(event=>({event,prompt:duePrompt(event)})).filter(row=>row.prompt);
  const markers=await db.getMany("event_prompts",due.map(row=>row.prompt.marker));
  // Bound each invocation's requests; completed markers let later cron runs continue the queue.
  return due.filter(row=>!markers.has(row.prompt.marker)).slice(0,4).map(row=>row.event);
}

export async function sendDueNotices(db,notices,id) {
  const event=await db.get("events",id);
  const prompt=event&&duePrompt(event);
  if(!prompt) return;
  const {kind,marker}=prompt;
  if(await db.get("event_prompts",marker)) return;
  const owner=await db.get("profiles",event.owner);
  if(!owner||owner.blocked||owner.deleted) {
    db.put("event_prompts",marker,{event_id:event.id});
    return;
  }
  const plans=await db.query("plans",[eq("event_id",event.id)]);
  const recipients=plans.filter(p=>p.joined&&(kind!=="attendance"||p.confirmedStart!==event.start)).map(p=>p.user_id);
  if(kind==="feedback") recipients.push(event.owner);
  await notices(db,event,[...new Set(recipients)].map(uid=>[uid,kind]));
  db.put("event_prompts",marker,{event_id:event.id});
}
