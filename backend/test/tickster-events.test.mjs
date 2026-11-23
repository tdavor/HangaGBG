import test from 'node:test';
import assert from 'node:assert/strict';
import {ticksterEvents,ticksterCalendar,ticksterCities} from '../tickster-events.mjs';
const now=Date.parse('2026-11-23T12:00:00Z');
const row={id:'g1gpyukje60tybu',name:'Konsert',startUtc:'2026-11-24T18:00:00Z',endUtc:'2026-11-24T21:00:00Z',eventHierarchyType:'event',state:'releasedForSale',venue:{name:'Pustervik',city:'Göteborg',country:'se'},organizer:{name:'Arrangör'},infoUrl:'https://evil.example',extra:'ignored'};
test('Tickster keeps regional upcoming events and safe links, excluding past events, vouchers and cancellations',()=>{
 const events=ticksterEvents([row,row,{...row,id:'cancelled123456',state:'cancelled'},{...row,id:'stockholm12345',venue:{city:'Stockholm',country:'se'}},{...row,id:'giftcard12345',name:'Presentkort'},{...row,id:'longterm12345',endUtc:'2099-01-01T00:00:00Z'},{...row,id:'past12345678',startUtc:'2026-11-22T18:00:00Z',endUtc:'2026-11-22T21:00:00Z'},{...row,id:'parent1234567',eventHierarchyType:'production'},{...row,id:'badtime123456',startUtc:'invalid'}],now);
 assert.equal(events.length,1);assert.equal(events[0].source,'https://www.tickster.com/sv/events/'+row.id);assert.equal(events[0].provider,'tickster');
 assert.equal(ticksterEvents([{...row,venue:{...row.venue,city:'Mölndal'}}],now).length,1);
 assert.doesNotMatch(JSON.stringify(events),/evil|extra/);
});
test('Tickster uses a backend header, bounded paging, deduplication and an hourly cache',async()=>{
 const calls=[],stored=[],pending=[];
 const response=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil:p=>pending.push(p)},{},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now,cache:{match:async()=>null,put:async(key,r)=>stored.push({key,header:r.headers.get('Cache-Control'),data:await r.json()})},send:async(url,options)=>{
 calls.push({url:String(url),options});return new Response(JSON.stringify({totalItems:1,items:[row]}));
 }});
 await Promise.all(pending);assert.equal(calls.length,ticksterCities.length);assert.equal((await response.json()).length,1);
 assert.ok(calls.every(c=>c.options.headers['X-API-KEY']==='test-secret'&&!c.url.includes('test-secret')));
 assert.equal(stored[0].header,'public, max-age=3600');assert.doesNotMatch(JSON.stringify(stored),/test-secret/);
});
test('cached Tickster events expire without another upstream call and missing key is optional',async()=>{
 const events=ticksterEvents([row],now);
 const response=await ticksterCalendar(new Request('https://example.test/tickster-events'),{}, {},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now+3*86400000,cache:{match:async()=>new Response(JSON.stringify(events))},send:()=>{throw new Error('No upstream call expected')}});
 assert.deepEqual(await response.json(),[]);
 assert.deepEqual(await (await ticksterCalendar(new Request('https://example.test/tickster-events'),{}, {},{})).json(),[]);
});
test('one unavailable city does not hide other regions or leak upstream errors',async()=>{
 const response=await ticksterCalendar(new Request('https://example.test/tickster-events'),{waitUntil(){}},{},{TICKSTER_API_KEY:'test-secret'},{clock:()=>now,cache:null,send:async url=>new URL(url).searchParams.get('query')==='city:Partille'?new Response('secret upstream error',{status:500}):new Response(JSON.stringify({items:[row],totalItems:1}))});
 assert.equal((await response.json()).length,1);
});
