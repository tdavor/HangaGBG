import test from 'node:test';
import assert from 'node:assert/strict';
import {ticksterEvents,mergeEvents,ticksterCalendar,externalCalendar} from '../external-events.mjs';
const now=Date.parse('2026-11-19T19:00:00Z');
const row={id:'g1gpyukje60tybu',name:'Live musik',startUtc:'2026-11-19T18:00:00',endUtc:'2026-11-19T21:00:00Z',state:'releasedForSale',eventHierarchyType:'event',venue:{name:'Nefertiti',city:'Göteborg',country:'SE'},organizer:{name:'Arrangör'}};
const request=new Request('https://example.test/city-events');
test('Tickster v1 UTC dates, active occurrences, city scope and trusted links',()=>{
 const items=ticksterEvents([row,{...row,state:'cancelled'},{...row,eventHierarchyType:'collection'},{...row,venue:{city:'Stockholm'}},{...row,endUtc:'2026-11-19T19:00:00Z'},{...row,startUtc:'bad'}],now);
 assert.equal(items.length,1);assert.equal(items[0].start,'2026-11-19T18:00:00.000Z');
 assert.equal(items[0].source,'https://www.tickster.com/sv/events/'+row.id);
 assert.equal(items[0].id,'tickster-'+row.id);
});
test('merge removes matching occurrences across providers while retaining different dates and venues',()=>{
 const event=ticksterEvents([row],now)[0];
 const city={...event,id:'city-id',title:' LIVE MUSIK ',provider:undefined};
 assert.equal(mergeEvents([[city],[event,event]],now).length,1);
 assert.equal(mergeEvents([[event,{...event,id:'other',start:'2026-11-20T18:00:00Z',end:'2026-11-20T21:00:00Z'},{...event,id:'another',place:'Pustervik'}]],now).length,3);
 assert.equal(mergeEvents([[event]],Date.parse(event.end)).length,0);
});
test('Tickster pagination uses v1 schema and header key; cached entries expire on read',async()=>{
 const calls=[],pending=[],writes=[];
 const cache={async match(){},async put(key,response){writes.push({key,items:await response.json()})}};
 const options={apiKey:'test-secret',clock:()=>now,cache,send:async(url,init)=>{
  calls.push({url:new URL(url),init});
  return Response.json({totalItems:101,items:calls.length===1?Array.from({length:100},()=>row):[row]});
 }};
 const items=await ticksterCalendar(request,{waitUntil:p=>pending.push(p)},options);
 await Promise.all(pending);
 assert.equal(items.length,1);assert.equal(calls.length,2);
 assert.equal(calls[1].url.searchParams.get('skip'),'100');
 assert.equal(calls[0].url.searchParams.get('query'),'city:Göteborg');
 assert.equal(calls[0].init.headers['X-API-KEY'],'test-secret');
 assert.ok(!calls[0].url.href.includes('test-secret'));
 assert.equal(writes.length,1);assert.ok(!writes[0].key.includes('test-secret'));
 assert.deepEqual(await ticksterCalendar(request,{}, {...options,clock:()=>Date.parse(items[0].end),cache:{async match(){return Response.json(items)}},send(){throw Error('unexpected')}}),[]);
});
test('missing key does not fetch Tickster and failed Tickster leaves city calendar available',async()=>{
 assert.deepEqual(await ticksterCalendar(request,{}, {send(){throw Error('unexpected')}}),[]);
 const city=[{id:'47e827a0-cb0d-4578-bff8-ef4c0041561e',title:'Library',place:'Library',start:'2026-11-20T10:00:00Z',end:'2026-11-20T12:00:00Z'}];
 const options={clock:()=>now,cache:{async match(key){return key.includes('city-events')?Response.json(city):undefined}},send:async()=>new Response('',{status:429})};
 const response=await externalCalendar(request,{TICKSTER_API_KEY:'secret'}, {},{},options);
 assert.equal(response.headers.get('X-Event-Sources'),'tickster-unavailable');
 assert.deepEqual(await response.json(),city);
});
