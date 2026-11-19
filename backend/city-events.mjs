const api = "https://microservices.goteborg.se/ua/kalendariet/public/activities/";
const calendar = "https://goteborg.se/wps/portal/kalendarium/kalendarium-start";
const idPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const stockholm = new Intl.DateTimeFormat("sv-SE", {
  timeZone:"Europe/Stockholm",year:"numeric",month:"2-digit",day:"2-digit",
  hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"
});
const localTime = ms => stockholm.format(new Date(ms)).replace(" ","T");

function time(value) {
  if (typeof value!=="string") return NaN;
  if (/(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return Date.parse(value);
  const local = value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)?.[0];
  if (!local) return NaN;
  const target = Date.parse(local+"Z");
  if (!Number.isFinite(target)) return NaN;
  let ms = target;
  for (let i=0;i<3;i++) ms += target-Date.parse(localTime(ms)+"Z");
  return localTime(ms)===local ? ms : NaN;
}

const label = (value, max) => typeof value==="string" ? value.trim().slice(0,max) : "";

export function cityEvents(rows, now=Date.now()) {
  const entries = new Map();
  for (const row of rows) {
    if (!row || !idPattern.test(row.id) || row.template || row.cancelled || row.published===false) continue;
    const start = time(row.startTime);
    const end = time(row.endTime);
    const expires = Number.isFinite(end) && end>=start ? end : start;
    const title = label(row.title,120);
    if (!title || !Number.isFinite(start) || expires<=now) continue;
    entries.set(row.id,{
      id:row.id, title, start:new Date(start).toISOString(), end:new Date(expires).toISOString(),
      place:label(row.location?.name,180),
      organizer:label(row.unit?.name,120),
      source:calendar+"?activityId="+row.id
    });
  }
  return [...entries.values()].sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));
}

function activeCachedEvents(items,now) {
  if(!Array.isArray(items)) throw new Error("Invalid cached city calendar");
  return items.filter(item=>item&&idPattern.test(item.id)&&Number.isFinite(Date.parse(item.start))&&
    Date.parse(item.end)>=Date.parse(item.start)&&Date.parse(item.end)>now);
}

export async function cityCalendar(request, ctx, headers, {send=fetch,cache=globalThis.caches?.default,clock=Date.now}={}) {
  const key = new URL("/city-events?format=2",request.url).href;
  const responseFor=items=>new Response(JSON.stringify(items),{
    headers:{...headers,"Cache-Control":"no-store"}
  });
  const cached = await cache?.match(key);
  if (cached) {
    try { return responseFor(activeCachedEvents(await cached.json(),clock())); }
    catch { /* Ignore invalid cached data and fetch the calendar again. */ }
  }
  const pages = await Promise.all([0,1,2,3].map(async page=>{
    const url = new URL(api);
    url.search = new URLSearchParams({published:"true",size:"100",page:String(page)});
    const response = await send(url,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error("City calendar unavailable");
    const data = await response.json();
    if (!Array.isArray(data.content)) throw new Error("Invalid city calendar");
    return data.content;
  }));
  const items=cityEvents(pages.flat(),clock());
  if (cache) {
    const stored=new Response(JSON.stringify(items),{headers:{...headers,"Cache-Control":"public, max-age=300"}});
    ctx.waitUntil(cache.put(key,stored));
  }
  return responseFor(items);
}
