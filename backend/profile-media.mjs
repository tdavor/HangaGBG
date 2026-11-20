// Photos are small JPEG data URLs, kept outside identity/profile list documents.
export const MAX_PHOTO_LENGTH=65536;
export function validatePhoto(value) {
  if(value==='') return '';
  if(typeof value!=='string'||value.length>MAX_PHOTO_LENGTH||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new Error('invalid');
  let bytes;
  try {bytes=Uint8Array.from(atob(value.slice(23)),c=>c.charCodeAt(0));} catch {throw new Error('invalid');}
  if(bytes[0]!==255||bytes[1]!==216||bytes[bytes.length-2]!==255||bytes[bytes.length-1]!==217) throw new Error('invalid');
  let size=false;
  for(let offset=2;offset+3<bytes.length;) {
    if(bytes[offset++]!==255) throw new Error('invalid');
    while(bytes[offset]===255)offset++;
    const marker=bytes[offset++];
    if(marker===218)break;
    const length=(bytes[offset]<<8)|bytes[offset+1];
    if(length<2||offset+length>bytes.length)throw new Error('invalid');
    if([192,193,194].includes(marker)) {
      if(length<8)throw new Error('invalid');
      const h=(bytes[offset+3]<<8)|bytes[offset+4],w=(bytes[offset+5]<<8)|bytes[offset+6];
      if(!h||!w||h>512||w>512)throw new Error('invalid');
      size=true;
    }
    offset+=length;
  }
  if(!size)throw new Error('invalid');
  return value;
}
export const profilePhoto=async(db,id)=>(await db.get('profile_photos',id))?.data||'';

export async function memberMeetups(db,member,viewer) {
  const [owned,plans]=await Promise.all([db.query('events',[['owner','EQUAL',member]]),db.query('plans',[['user_id','EQUAL',member]])]);
  const joined=await db.getMany('events',plans.filter(p=>p.joined).map(p=>p.event_id));
  const events=[...new Map([...owned,...joined.values()].map(e=>[e.id,e])).values()];
  const owners=await db.getMany('profiles',events.map(e=>e.owner));
  const blocks=await db.getMany('blocks',events.flatMap(e=>[viewer+'-'+e.owner,e.owner+'-'+viewer]));
  return events.filter(e=>{
    const organizer=owners.get(String(e.owner));
    return organizer&&!organizer.deleted&&!organizer.blocked&&!e.hidden&&!e.cancelled&&
      (!e.minPeople||e.proposalPhase==='active')&&!blocks.has(viewer+'-'+e.owner)&&!blocks.has(e.owner+'-'+viewer);
  }).map(e=>({id:e.id,title:e.title,titleEn:e.titleEn||'',start:e.start,end:e.end||e.start,
    category:e.category,area:e.area,place:e.place,organizer:owners.get(String(e.owner)).name,
    organized:e.owner===member})).sort((a,b)=>{const ap=Date.parse(a.end)<=Date.now(),bp=Date.parse(b.end)<=Date.now();return Number(ap)-Number(bp)||(ap?b.start.localeCompare(a.start):a.start.localeCompare(b.start))||b.id-a.id;});
}
