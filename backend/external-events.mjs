import {cityCalendar} from './city-events.mjs';

const ticksterId = /^[a-z0-9]{10,32}$/i;
const text = (v,n) => typeof v==='string' ? v.trim().slice(0,n) : '';
const normalized = v => text(v,200).normalize('NFKC').toLocaleLowerCase('sv-SE').replace(/[^\p{L}\p{N}]/gu,'');
// Tickster documents these fields as UTC, including responses without a suffix.
const utc = value => typeof value==='string' ? Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)?value:value+'Z') : NaN;
export function ticksterEvents(rows,now=Date.now()) {
  return rows.flatMap(row=>{
    if (!row || !ticksterId.test(row.id) || !['event','production-child'].includes(row.eventHierarchyType)
      || !['releasedForSale','salePaused','saleEnded'].includes(row.state)
      || !['göteborg','gothenburg'].includes(text(row.venue?.city,80).toLowerCase())
      || (row.venue?.country && row.venue.country!=='SE')) return [];
    const start=utc(row.startUtc),finish=utc(row.endUtc);
    const end=Number.isFinite(finish)&&finish>=start?finish:start;
    const title=text(row.name,120);
    if (!title || !Number.isFinite(start) || end<=now) return [];
    return [{id:'tickster-'+row.id,title,start:new Date(start).toISOString(),end:new Date(end).toISOString(),
      place:text(row.venue?.name,180),organizer:text(row.organizer?.name,120),
      provider:'tickster',source:'https://www.tickster.com/sv/events/'+row.id}];
  });
}

export function mergeEvents(groups,now=Date.now()) {
  const ids=new Set(),occurrences=new Set(),items=[];
  for (const event of groups.flat()) {
    if (!event || !Number.isFinite(Date.parse(event.start)) || Date.parse(event.end)<Date.parse(event.start) || !(Date.parse(event.end)>now)) continue;
    // Require a title, exact instant and nonempty matching venue. Never merge different dates.
    const venue=normalized(event.place),title=normalized(event.title);
    const occurrence=title&&venue?JSON.stringify([title,new Date(event.start).toISOString(),venue]):null;
    if(ids.has(event.id) || (occurrence&&occurrences.has(occurrence))) continue;
    ids.add(event.id);if(occurrence) occurrences.add(occurrence);items.push(event);
  }
  return items.sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));
}

export async function ticksterCalendar(request,ctx,{apiKey,send=fetch,cache=globalThis.caches?.default,clock=Date.now}={}) {
  if(!apiKey) return [];
  const key=new URL('/tickster-events?format=1',request.url).href;
  const cached=await cache?.match(key);
  if(cached) {
    try { const items=await cached.json();if(Array.isArray(items)) return mergeEvents([items],clock()); }
    catch { /* Refresh malformed cache. */ }
  }
  const rows=[],signal=AbortSignal.timeout(10000);
  // Bound upstream work while supporting up to 2,000 local events.
  for(let skip=0;skip<2000;skip+=100) {
    const url=new URL('https://event.api.tickster.com/api/v1.0/sv/events');
    url.search=new URLSearchParams({query:'city:Göteborg',take:'100',skip:String(skip)});
    const response=await send(url,{headers:{Accept:'application/json','X-API-KEY':apiKey},signal});
    if(!response.ok) throw new Error('Tickster unavailable');
    const data=await response.json();
    if(!Array.isArray(data.items)) throw new Error('Invalid Tickster response');
    rows.push(...data.items);
    if(data.items.length<100 || skip+data.items.length>=data.totalItems) break;
  }
  const items=mergeEvents([ticksterEvents(rows,clock())],clock());
  if(cache) ctx.waitUntil(cache.put(key,new Response(JSON.stringify(items),{headers:{'Cache-Control':'public, max-age=900'}})));
  return items;
}

export async function externalCalendar(request,env,ctx,headers,options={}) {
  const [city,tickster]=await Promise.allSettled([
    cityCalendar(request,ctx,headers,options).then(response=>response.json()),
    ticksterCalendar(request,ctx,{...options,apiKey:env.TICKSTER_API_KEY})
  ]);
  if(city.status==='rejected' && (tickster.status==='rejected'||!env.TICKSTER_API_KEY)) throw new Error('Calendars unavailable');
  const status=[city.status==='rejected'?'city-unavailable':null,
    !env.TICKSTER_API_KEY?'tickster-unconfigured':tickster.status==='rejected'?'tickster-unavailable':null].filter(Boolean).join(',');
  return new Response(JSON.stringify(mergeEvents([city.status==='fulfilled'?city.value:[],tickster.status==='fulfilled'?tickster.value:[]],(options.clock||Date.now)())),{
    headers:{...headers,'Cache-Control':'no-store','X-Event-Sources':status||'ok'}
  });
}
