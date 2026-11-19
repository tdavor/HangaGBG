import {acceptFriendship} from "./friends.mjs";
const eq=(field,value)=>[field,'EQUAL',value];
const key=(a,b)=>a+'-'+b;
const fail=code=>{throw new Error(code)};
const matchKey=(event,a,b)=>event+'-'+Math.min(a,b)+'-'+Math.max(a,b);

export function socialFields(p,old) {
  const minPeople=p.minPeople??old?.minPeople??0;
  if(!Number.isSafeInteger(minPeople)||minPeople<0||(minPeople!==0&&minPeople<2)||minPeople>21||
    (minPeople>0&&(p.capacity>20||minPeople>p.capacity+1))||
    (old&&minPeople!==(old.minPeople||0))) fail('invalid');
  const walkGoal=p.walkGoal??old?.walkGoal??'';
  if(!['','view','photo','cafe','discover'].includes(walkGoal)) fail('invalid');
  return {minPeople,walkGoal:p.category==='walk'?walkGoal:''};
}
async function peerAllowed(db,a,b) {
  const person=await db.get('profiles',b);
  if(!person||person.deleted||person.blocked||await db.get('blocks',key(a,b))||await db.get('blocks',key(b,a))) fail('missing');
  return person;
}
export async function socialAction(db,name,p,me,{integer,notices}) {
  if(!['interest','proposal_confirm','again_list','again_change'].includes(name)) return null;
  if(['interest','again_change'].includes(name)&&typeof p.enabled!=='boolean') fail('invalid');
  const id=integer(p.id),uid=me.id,e=await db.get('events',id);
  if(!e||e.hidden||e.cancelled) fail('missing');
  await peerAllowed(db,uid,e.owner);
  const plans=await db.query('plans',[eq('event_id',id)]);
  const own=plans.find(row=>row.user_id===uid)||{event_id:id,user_id:uid,joined:false,saved:false,waitlisted:false};
  if(name.startsWith('again_')) {
    if((e.minPeople&&e.proposalPhase!=='active')||Date.parse(e.end||e.start)>Date.now()||!(uid===e.owner||own.joined)) fail('forbidden');
    const members=[...new Set([e.owner,...plans.filter(row=>row.joined).map(row=>row.user_id)])];
    const people=await db.getMany('profiles',members);
    const blocks=await db.query('blocks');
    const peers=[...people.values()].filter(person=>person.id!==uid&&!person.deleted&&!person.blocked&&!blocks.some(b=>
      (b.blocker===uid&&b.blocked===person.id)||(b.blocked===uid&&b.blocker===person.id)));
    const choices=await db.query('again_choices',[eq('event_id',id),eq('user_id',uid)]);
    const matches=await db.query('again_matches',[eq('event_id',id)]);
    if(name==='again_list') return peers.map(person=>({id:person.id,name:person.name,
      selected:choices.some(row=>row.target===person.id),matched:matches.some(row=>row.users.includes(uid)&&row.users.includes(person.id))}));
    const target=integer(p.peer),person=peers.find(row=>row.id===target);
    if(!person) fail('missing');
    const pair=matchKey(id,uid,target);
    if(matches.some(row=>row.id===pair)) return {};
    const claim=id+'-'+uid+'-'+target;
    if(p.enabled===false){db.remove('again_choices',claim);return {};}
    const reciprocal=await db.get('again_choices',id+'-'+target+'-'+uid);
    // Serialize opposite choices, so simultaneous selections cannot miss a mutual match.
    const revision=await db.get('again_pairs',pair);
    db.put('again_pairs',pair,{id:pair,event_id:id,users:[uid,target],revision:(revision?.revision||0)+1});
    db.put('again_choices',claim,{id:claim,event_id:id,user_id:uid,target});
    if(reciprocal) {
      await acceptFriendship(db,uid,target,id);
      db.put('again_matches',pair,{id:pair,event_id:id,users:[uid,target],created:new Date().toISOString()});
      await notices(db,e,[[uid,'again',person.name]]);
      await notices(db,e,[[target,'again',me.name]]);
    }
    return {};
  }
  if(!e.minPeople||Date.parse(e.start)<=Date.now()||e.proposalPhase==='active') fail('forbidden');
  const people=await db.getMany('profiles',plans.filter(row=>row.interested).map(row=>row.user_id));
  const blocks=await db.query("blocks");
  const denied=new Set(blocks.filter(b=>b.blocker===e.owner||b.blocked===e.owner).map(b=>b.blocker===e.owner?b.blocked:b.blocker));
  const interested=plans.filter(row=>row.interested&&row.user_id!==e.owner&&!denied.has(row.user_id)&&people.get(String(row.user_id))&&!people.get(String(row.user_id)).blocked&&!people.get(String(row.user_id)).deleted);
  let current=interested.map(row=>({...row}));
  let updated={...e};
  const alerts=[];
  if(name==='interest') {
    if(uid===e.owner) fail('invalid');
    current=current.filter(row=>row.user_id!==uid);
    if(p.enabled===true) {
      if(current.length>=e.capacity&&!own.interested) fail('full');
      own.interested=true;current.push(own);
    } else {
      own.interested=false;own.proposalConfirmed=false;
    }
    if(own.interested||own.joined||own.saved||own.waitlisted) db.put('plans',key(id,uid),own);
    else db.remove('plans',key(id,uid));
    const ready=current.length+1>=e.minPeople;
    updated.interestCount=current.length;
    updated.count=current.filter(row=>row.proposalConfirmed).length;
    updated.proposalPhase=ready?'confirming':'collecting';
    if(!ready) {
      updated.ownerConfirmed=false;updated.count=0;
      for(const row of current){row.proposalConfirmed=false;db.put('plans',key(id,row.user_id),row);}
    }
    if(ready&&e.proposalPhase!=='confirming') alerts.push(...[e.owner,...current.map(row=>row.user_id)].map(user=>[user,'proposalReady']));
    else if(ready&&p.enabled===true&&!own.proposalConfirmed) alerts.push([uid,'proposalReady']);
  } else {
    if(e.proposalPhase!=='confirming') fail('forbidden');
    if(current.length+1<e.minPeople) {
      for(const row of current) db.put('plans',key(id,row.user_id),{...row,proposalConfirmed:false});
      db.put('events',id,{...e,proposalPhase:'collecting',interestCount:current.length,ownerConfirmed:false,count:0});
      return {};
    }
    if(uid===e.owner) updated.ownerConfirmed=true;
    else {
      const row=current.find(row=>row.user_id===uid);
      if(!row) fail('forbidden');
      row.proposalConfirmed=true;
      db.put('plans',key(id,uid),row);
    }
    const confirmed=current.filter(row=>row.proposalConfirmed);
    updated.count=confirmed.length;
    if(updated.ownerConfirmed&&confirmed.length+1>=e.minPeople) {
      updated.proposalPhase='active';
      for(const row of confirmed) db.put('plans',key(id,row.user_id),{...row,joined:true,interested:false});
      alerts.push(...[e.owner,...current.map(row=>row.user_id)].map(user=>[user,'proposalActive']));
    }
  }
  db.put('events',id,updated);
  await notices(db,updated,alerts);
  return {};
}

export async function resetPendingProposal(db,event,updated,plans) {
  if(!event.minPeople||event.proposalPhase==='active'||!['start','place','area'].some(field=>event[field]!==updated[field])) return updated;
  for(const plan of plans.filter(row=>row.interested)) db.put('plans',key(event.id,plan.user_id),{...plan,proposalConfirmed:false});
  return {...updated,ownerConfirmed:false,count:0};
}

export async function withdrawIdeaMember(db,event,uid) {
  if(!event.minPeople||event.proposalPhase==='active') return;
  const plans=await db.query('plans',[eq('event_id',event.id)]);
  const remaining=plans.filter(row=>row.interested&&row.user_id!==uid&&row.user_id!==event.owner);
  const ready=remaining.length+1>=event.minPeople;
  for(const row of remaining) if(!ready) db.put('plans',key(event.id,row.user_id),{...row,proposalConfirmed:false});
  db.put('events',event.id,{...event,interestCount:remaining.length,proposalPhase:ready?'confirming':'collecting',
    ownerConfirmed:ready?!!event.ownerConfirmed:false,count:ready?remaining.filter(row=>row.proposalConfirmed).length:0});
}
