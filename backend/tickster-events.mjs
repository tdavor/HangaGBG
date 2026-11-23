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
export async function ticksterCalendar(request,ctx,headers,env,{send=fetch,cache=globalThis.caches?.default,clock=Date.now}={}){
  if(!env.TICKSTER_API_KEY)return new Response('[]',{headers:{...headers,'Cache-Control':'no-store'}});
  const key=new URL('/tickster-events?format=2',request.url).href;
  const respond=items=>new Response(JSON.stringify(items),{headers:{...headers,'Cache-Control':'no-store'}});
  const cached=await cache?.match(key);
  if(cached){try{const rows=await cached.json();if(Array.isArray(rows))return respond(active(rows,clock()));}catch{}}
  const batches=await Promise.allSettled(ticksterCities.map(async city=>{
    const rows=[];
    // Bounded pagination: at most 8 requests per refresh, cached for an hour.
    for(let page=0;page<(city==='Göteborg'?8:1);page++){
      const url=new URL(endpoint);url.search=new URLSearchParams({query:'city:'+city,take:'100',skip:String(page*100)});
      const response=await send(url,{headers:{Accept:'application/json','X-API-KEY':env.TICKSTER_API_KEY},redirect:'error',signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('Tickster unavailable');
      const data=await response.json();if(!Array.isArray(data.items))throw new Error('Invalid Tickster response');
      rows.push(...data.items);
      if(data.items.length<100||(page+1)*100>=data.totalItems||Number(response.headers.get('X-RATELIMIT-REMAINING')||100)<=5)break;
    }
    return rows;
  }));
  const successful=batches.filter(b=>b.status==='fulfilled');
  if(!successful.length)throw new Error('Tickster unavailable');
  const items=ticksterEvents(successful.flatMap(b=>b.value),clock());
  if(cache)ctx.waitUntil(cache.put(key,new Response(JSON.stringify(items),{headers:{...headers,'Cache-Control':'public, max-age=3600'}})));
  return respond(items);
}
