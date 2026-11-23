import test from 'node:test';
import assert from 'node:assert/strict';
import {ticksterEvents,ticksterCalendar,ticksterCities} from '../tickster-events.mjs';
const now=Date.parse('2026-11-23T12:00:00Z');
const row={id:'g1gpyukje60tybu',name:'Konsert',startUtc:'2026-11-24T18:00:00Z',endUtc:'2026-11-24T21:00:00Z',eventHierarchyType:'event',state:'releasedForSale',venue:{name:'Pustervik',city:'Göteborg',country:'se'},organizer:{name:'Arrangör'},infoUrl:'https://evil.example',extra:'ignored'};
test('Tickster keeps regional upcoming events and safe links, excluding past events, vouchers and cancellations',()=>{
 const events=ticksterEvents([row,row,{...row,id:'cancelled123456',state:'cancelled'},{...row,id:'stockholm12345',venue:{city:'Stockholm',country:'se'}},{...row,id:'giftcard12345',name:'Presentkort'},{...row,id:'longterm12345',endUtc:'2099-01-01T00:00:00Z'},{...row,id:'past12345678',startUtc:'2026-11-22T18:00:00Z',endUtc:'2026-11-22T21:00:00Z'},{...row,id:'parent1234567',eventHierarchyType:'production'},{...row,id:'badtime123456',startUtc:'invalid'}],now);
 assert.equal(events.length,1);assert.equal(events[0].source,'https://www.tickster.com/sv/events/'+row.id);assert.equal(events[0].provider,'tickster');
 for(const city of ['Mölndal','Partille','Kungälv','Kungsbacka','Lerum','Göteborgs Stad','Stockholm'])assert.equal(ticksterEvents([{...row,venue:{...row.venue,city}}],now).length,0);
 assert.equal(ticksterEvents([{...row,venue:{...row.venue,city:'GÖTEBORG'}}],now).length,1);
 assert.doesNotMatch(JSON.stringify(events),/evil|extra/);
});
test('Tickster uses a backend header, bounded paging, deduplication and an hourly cache',async()=>{
 const calls=[],stored=[],pending=[];
 const response=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil:p=>pending.push(p)},{},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now,cache:{match:async()=>null,put:async(key,r)=>stored.push({key,header:r.headers.get('Cache-Control'),data:await r.json()})},send:async(url,options)=>{
 calls.push({url:String(url),options});return new Response(JSON.stringify({totalItems:1,items:[row]}));
 }});
 await Promise.all(pending);assert.equal(calls.length,ticksterCities.length);assert.ok(calls.every(c=>new URL(c.url).searchParams.get('query')==='city:Göteborg'));assert.equal((await response.json()).length,1);
 assert.ok(calls.every(c=>c.options.headers['X-API-KEY']==='test-secret'&&!c.url.includes('test-secret')));
 assert.equal(stored[0].header,'public, max-age=3600');assert.doesNotMatch(JSON.stringify(stored),/test-secret/);
});
test('cached Tickster events expire without another upstream call and missing key is optional',async()=>{
 const events=ticksterEvents([row],now);
 const response=await ticksterCalendar(new Request('https://example.test/tickster-events'),{}, {},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now+3*86400000,cache:{match:async()=>new Response(JSON.stringify(events))},send:()=>{throw new Error('No upstream call expected')}});
 assert.deepEqual(await response.json(),[]);
 assert.deepEqual(await (await ticksterCalendar(new Request('https://example.test/tickster-events'),{}, {},{})).json(),{error:'ticksterNotConfigured'});
});
test('Tickster upstream failure is reported without exposing credentials',async()=>{
 assert.deepEqual(await (await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil(){}},{},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now,cache:null,send:async()=>new Response('secret upstream error',{status:500})})).json(),{error:'ticksterUnavailable'});
});

test('later page failure preserves successful events rather than failing the whole feed',async()=>{
 const stored=[],pending=[];
 const r=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil:p=>pending.push(p)},{},{TICKSTER_API_KEY:' key-with-space '},{clock:()=>now,cache:{match:async()=>null,put:async(_,r)=>stored.push(r.headers.get('Cache-Control'))},send:async(url,options)=>{
 assert.equal(options.headers['X-API-KEY'],'key-with-space');
 if(new URL(url).searchParams.get('skip')==='100')throw Object.assign(new Error('Timeout'),{name:'TimeoutError'});
 return new Response(JSON.stringify({totalItems:200,items:Array(100).fill(row)}));
 }});
 assert.equal((await r.json()).length,1);await Promise.all(pending);assert.deepEqual(stored,['public, max-age=600']);
});
test('credential and rate-limit failures return safe codes and cache a backoff without secrets',async()=>{
 for(const [status,code] of [[401,'ticksterCredentials'],[403,'ticksterCredentials'],[429,'ticksterRateLimited']]){
 const stored=[],pending=[];
 const result=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil:p=>pending.push(p)},{},{TICKSTER_API_KEY:'secret-key'},{cache:{match:async()=>null,put:async(_,r)=>stored.push({data:await r.json(),ttl:r.headers.get('Cache-Control')})},send:async()=>new Response('private upstream response',{status})});
 assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:code});
 await Promise.all(pending);assert.deepEqual(stored,[{data:{error:code},ttl:'public, max-age=300'}]);assert.doesNotMatch(JSON.stringify(stored),/secret-key|private upstream/);
 }
});

test('Tickster uses Workers-compatible manual redirects and never forwards credentials to a redirect destination',async()=>{
 let calls=0;
 const send=async(url,options)=>{
  calls++;
  // Cloudflare workerd rejects redirect:error before sending a network request.
  if(options.redirect==='error')throw new TypeError('Unsupported redirect mode');
  assert.equal(options.redirect,'manual');
  assert.equal(new URL(url).hostname,'event.api.tickster.com');
  return new Response(null,{status:302,headers:{Location:'https://other.example/collect'}});
 };
 const result=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil(){}},{},{TICKSTER_API_KEY:'test-secret'},{cache:null,send});
 assert.equal(calls,1);assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:'ticksterUnavailable'});
 const success=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil(){}},{},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now,cache:null,send:async(url,options)=>{
  if(options.redirect==='error')throw new TypeError('Unsupported redirect mode');
  assert.equal(options.redirect,'manual');return new Response(JSON.stringify({totalItems:1,items:[row]}));
 }});
 assert.equal(success.status,200);assert.equal((await success.json()).length,1);
});
