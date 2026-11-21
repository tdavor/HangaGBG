import {availabilityContact} from "./availability-contact.mjs";
const eq=(field,value)=>[field,'EQUAL',value];
const fail=code=>{throw new Error(code)};
export const friendKey=(a,b)=>Math.min(a,b)+'-'+Math.max(a,b);
export async function friendAllowed(db,uid,peer) {
  const person=await db.get('profiles',peer);
  if(uid===peer||!person||person.deleted||person.blocked||await db.get('blocks',uid+'-'+peer)||await db.get('blocks',peer+'-'+uid)) fail('missing');
  return person;
}
export async function sharedMeetup(db,uid,peer,past=false) {
  const plans=await db.query('plans',[eq('user_id',uid)]);
  const owned=await db.query('events',[eq('owner',uid)]);
  const selected=await db.getMany('events',plans.filter(p=>p.joined).map(p=>p.event_id));
  const events=[...new Map([...owned,...selected.values()].map(e=>[e.id,e])).values()].filter(e=>!e.hidden&&!e.cancelled&&
    (!e.minPeople||e.proposalPhase==='active')&&(!past||Date.parse(e.end||e.start)<=Date.now()));
  const peers=await db.getMany('plans',events.map(e=>e.id+'-'+peer));
  const owners=await db.getMany('profiles',events.map(e=>e.owner));
  return events.find(e=>owners.get(String(e.owner))&&!owners.get(String(e.owner)).blocked&&!owners.get(String(e.owner)).deleted&&
    (e.owner===peer||peers.get(e.id+'-'+peer)?.joined));
}
async function connectionExists(db,uid,peer) {
  if(await sharedMeetup(db,uid,peer,true)) return true;
  const sent=await db.query('messages',[eq('sender',uid),eq('recipient',peer)],null,1);
  const received=await db.query('messages',[eq('sender',peer),eq('recipient',uid)],null,1);
  return !!(sent.length||received.length);
}
export async function acceptFriendship(db,uid,peer,eventId=0) {
  const id=friendKey(uid,peer),old=await db.get('friendships',id);
  if(old?.status==='accepted') return;
  db.put('friendships',id,{id,users:[Math.min(uid,peer),Math.max(uid,peer)],status:'accepted',requester:old?.requester||uid,event_id:old?.event_id||eventId,created:old?.created||new Date().toISOString()});
}
export async function validFriendNotices(db,uid,rows) {
  const relevant=rows.filter(row=>['friendRequest','friendAccepted'].includes(row.kind)&&row.peer_id);
  if(!relevant.length) return new Set();
  const relations=await db.getMany('friendships',relevant.map(row=>friendKey(uid,row.peer_id)));
  const people=await db.getMany('profiles',relevant.map(row=>row.peer_id));
  const blocks=await db.getMany('blocks',relevant.flatMap(row=>[uid+'-'+row.peer_id,row.peer_id+'-'+uid]));
  return new Set(relevant.filter(row=>{
    const p=people.get(String(row.peer_id)),relation=relations.get(friendKey(uid,row.peer_id));
    return p&&!p.deleted&&!p.blocked&&!blocks.has(uid+'-'+row.peer_id)&&!blocks.has(row.peer_id+'-'+uid)&&relation&&
      (row.kind==='friendRequest'?relation.status==='pending'&&relation.requester===row.peer_id:relation.status==='accepted');
  }).map(row=>row.id));
}
export async function friendAction(db,name,p,me,{integer,notices,writeMessage,env={}}) {
  if(!['friend_list','friend_status','friend_request','friend_reply','friend_remove','friend_invite','chat_peer'].includes(name)) return null;
  const uid=me.id;
  if(name==='friend_list') {
    const relations=await db.query('friendships',[['users','ARRAY_CONTAINS',uid]]);
    const peers=relations.map(row=>row.users.find(id=>id!==uid));
    const people=await db.getMany('profiles',peers),blocks=await db.getMany('blocks',peers.flatMap(id=>[uid+'-'+id,id+'-'+uid]));
    return relations.filter(row=>['pending','accepted'].includes(row.status)).flatMap(row=>{
      const id=row.users.find(id=>id!==uid),person=people.get(String(id));
      if(!person||person.blocked||person.deleted||blocks.has(uid+'-'+id)||blocks.has(id+'-'+uid)) return [];
      return [{id,name:person.name,bio:person.bio||'',languages:person.languages||'',status:row.status,direction:row.requester===uid?'outgoing':'incoming'}];
    }).sort((a,b)=>a.name.localeCompare(b.name));
  }
  const peer=integer(p.peer),person=await friendAllowed(db,uid,peer);
  const id=friendKey(uid,peer),relation=await db.get('friendships',id);
  if(name==='friend_status') return {id:peer,status:relation?.status==='accepted'?'accepted':relation?.status==='pending'?relation.requester===uid?'outgoing':'incoming':'none',
    canRequest:!relation?.status||relation.status==='declined'&&relation.retryAfter<=Date.now()?await connectionExists(db,uid,peer):false};
  if(name==='chat_peer') {
    const adminContact=!!me.admin||await canReplyToAdmin(db,uid,peer,env);
    const companyContact=await availabilityContact(db,uid,peer);
    return {id:peer,name:person.name,friend:relation?.status==='accepted',adminContact,availabilityContact:companyContact,canSend:adminContact||companyContact||relation?.status==='accepted'||!!await sharedMeetup(db,uid,peer)};
  }
  if(name==='friend_remove') {
    if(relation?.status==='declined') return {};
    if(relation?.status==='pending'&&relation.requester!==uid) fail('forbidden');
    if(relation) db.remove('friendships',id);
    return {};
  }
  if(name==='friend_request') {
    if(relation?.status==='accepted'||relation?.status==='pending'&&relation.requester===uid) return {};
    if(relation?.status==='declined'&&relation.retryAfter>Date.now()) fail('forbidden');
    if(relation?.status!=='pending'&&!await connectionExists(db,uid,peer)) fail('forbidden');
    if(relation?.status==='pending') {
      await acceptFriendship(db,uid,peer,relation.event_id);
      await notices(db,{id:0,title:me.name,friendPeer:uid},[[peer,'friendAccepted',me.name]]);
    } else {
      db.put('friendships',id,{id,users:[Math.min(uid,peer),Math.max(uid,peer)],requester:uid,status:'pending',event_id:0,created:new Date().toISOString()});
      await notices(db,{id:0,title:me.name,friendPeer:uid},[[peer,'friendRequest',me.name]]);
    }
    return {};
  }
  if(name==='friend_reply') {
    if(typeof p.accept!=='boolean') fail('invalid');
    if(!relation||relation.requester===uid) fail('forbidden');
    if(relation.status==='accepted') return {};
    if(relation.status!=='pending') fail('missing');
    if(p.accept) {
      await acceptFriendship(db,uid,peer,relation.event_id);
      await notices(db,{id:0,title:me.name,friendPeer:uid},[[peer,'friendAccepted',me.name]]);
    } else db.put('friendships',id,{...relation,status:'declined',retryAfter:Date.now()+7*86400000});
    return {};
  }
  if(relation?.status!=='accepted') fail('forbidden');
  const eventId=integer(p.id),e=await db.get('events',eventId);
  const plan=await db.get('plans',eventId+'-'+uid);
  const owner=e&&await db.get('profiles',e.owner);
  if(!e||e.hidden||e.cancelled||!owner||owner.deleted||owner.blocked||Date.parse(e.start)<=Date.now()||
    e.minPeople&&e.proposalPhase!=='active'||!(e.owner===uid||plan?.joined)) fail('forbidden');
  const english=p.lang==='en';
  const body=(english?'Would you like to join me?':'Vill du följa med?')+'\n'+e.title+'\n'+new Date(e.start).toLocaleString(english?'en-GB':'sv-SE',{timeZone:'Europe/Stockholm'})+'\n'+e.place+', '+e.area;
  return writeMessage(db,me,peer,eventId,e.title,body,{invite_event:eventId});
}

export async function canReplyToAdmin(db,uid,peer,env) {
  const person=await db.get('profiles',peer);
  if(!person||person.deleted||person.blocked||!(person.admin||person.uid===env.ADMIN_UID)) return false;
  const sent=await db.query('messages',[eq('sender',peer),eq('recipient',uid)]);
  return sent.some(message=>message.admin_message===true);
}
