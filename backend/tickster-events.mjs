const endpoint='https://event.api.tickster.com/api/v1.0/sv/events';
export const ticksterCities=['Göteborg'];
const normalized=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').trim().toLowerCase();
const cities=new Set(ticksterCities.map(normalized));
const label=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
export function ticksterEvents(rows,now=Date.now()) {
  const result=new Map();
  for(const row of rows){
    if(!row||!/^[a-z0-9]{10,32}$/i.test(row.id)||!['event','production-child'].includes(row.eventHierarchyType)||
      !['releasedForSale','salePaused','saleEnded'].includes(row.state)||!cities.has(normalized(row.venue?.city))||
      normalized(row.venue?.country)!=='se')continue;
    const title=label(row.name,120),start=Date.parse(row.startUtc),rawEnd=Date.parse(row.endUtc);
    const end=Number.isFinite(rawEnd)&&rawEnd>=start?rawEnd:start;
    if(!title||!Number.isFinite(start)||start<now||end-start>7*86400000||/presentkort|gift\s*(card|voucher)/i.test(title))continue;
    result.set(row.id,{id:'tickster-'+row.id,title,start:new Date(start).toISOString(),end:new Date(end).toISOString(),
      place:label([row.venue?.name,row.venue?.address,row.venue?.city].filter(Boolean).join(', '),180),
      area:ticksterCities.find(city=>normalized(city)===normalized(row.venue?.city)),organizer:label(row.organizer?.name,120),provider:'tickster',
      source:'https://www.tickster.com/sv/events/'+row.id});
  }
  return [...result.values()].sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));
}
const active=(rows,now)=>rows.filter(row=>row&&/^tickster-[a-z0-9]{10,32}$/i.test(row.id)&&Date.parse(row.start)>=now&&Date.parse(row.end)>=now);
export class TicksterError extends Error {
  constructor(code){super(code);this.code=code;}
}
export async function ticksterCalendar(request,ctx,headers,env,options={}){
  try{return await ticksterCalendarData(request,ctx,headers,env,options);}
  catch(error){if(!(error instanceof TicksterError))throw error;return new Response(JSON.stringify({error:error.code}),{status:503,headers:{...headers,'Cache-Control':'no-store'}});}
}
async function ticksterCalendarData(request,ctx,headers,env,{send=fetch,cache=globalThis.caches?.default,clock=Date.now}={}){
  const apiKey=typeof env.TICKSTER_API_KEY==='string'?env.TICKSTER_API_KEY.trim():'';
  if(!apiKey)throw new TicksterError('ticksterNotConfigured');
  const key=new URL('/tickster-events?format=3',request.url).href;
  const respond=items=>new Response(JSON.stringify(items),{headers:{...headers,'Cache-Control':'no-store'}});
  const cached=await cache?.match(key);
  if(cached){try{const data=await cached.json();if(Array.isArray(data))return respond(active(data,clock()));if(data.error&&['ticksterCredentials','ticksterRateLimited','ticksterUnavailable','ticksterTimeout','ticksterInvalidResponse'].includes(data.error))throw new TicksterError(data.error);}catch(error){if(error instanceof TicksterError)throw error;}}
  async function page(skip){
    const url=new URL(endpoint);url.search=new URLSearchParams({query:'city:Göteborg',take:'100',skip:String(skip)});
    let response;
    try{response=await send(url,{headers:{Accept:'application/json','X-API-KEY':apiKey},redirect:'error',signal:AbortSignal.timeout(25000)});}
    catch(error){throw new TicksterError(['TimeoutError','AbortError'].includes(error.name)?'ticksterTimeout':'ticksterUnavailable');}
    if(!response.ok)throw new TicksterError([401,403].includes(response.status)?'ticksterCredentials':response.status===429?'ticksterRateLimited':'ticksterUnavailable');
    let data;try{data=await response.json();}catch{throw new TicksterError('ticksterInvalidResponse');}
    if(!Array.isArray(data.items))throw new TicksterError('ticksterInvalidResponse');
    return {...data,remaining:Number(response.headers.get('X-RATELIMIT-REMAINING')||100)};
  }
  let first;
  try{first=await page(0);}catch(error){
    if(cache&&error instanceof TicksterError)ctx.waitUntil(cache.put(key,new Response(JSON.stringify({error:error.code}),{headers:{...headers,'Cache-Control':'public, max-age=300'}})));
    throw error;
  }
  const count=first.items.length<100||first.remaining<=5?1:Math.min(8,Math.max(1,Math.ceil(Number(first.totalItems||100)/100)));
  // Later pages run concurrently. A slow or unavailable page cannot discard the first page.
  const later=await Promise.allSettled(Array.from({length:count-1},(_,i)=>page((i+1)*100)));
  const items=ticksterEvents([first,...later.filter(p=>p.status==='fulfilled').map(p=>p.value)].flatMap(p=>p.items),clock());
  if(cache)ctx.waitUntil(cache.put(key,new Response(JSON.stringify(items),{headers:{...headers,'Cache-Control':'public, max-age='+(later.some(p=>p.status==='rejected')?600:3600)}})));
  return respond(items);
}
