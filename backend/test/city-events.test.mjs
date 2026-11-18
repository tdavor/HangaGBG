import test from "node:test";
import assert from "node:assert/strict";
import {cityEvents} from "../city-events.mjs";

const communityCalendarId = "47e827a0-cb0d-4578-bff8-ef4c0041561e";

test("city feed keeps ongoing events, deduplicates occurrences and drops ended or unpublished events",()=>{
  const activity = {
    id:communityCalendarId, title:"Bibliotekskväll",
    startTime:"2026-11-18T18:00:00", endTime:"2026-11-18T20:00:00",
    location:{name:"Biblioteksgatan 1"},unit:{name:"Biblioteket"},
    contact:{email:"not-exported@example.invalid"}
  };
  const now=Date.parse("2026-11-18T18:00:00Z");
  const items=cityEvents([
    activity, activity,
    {...activity,id:"3dbc5ddb-6b09-43e7-ba70-f03fcd3a3376",endTime:"2026-11-18T19:00:00"},
    {...activity,id:"faee64ac-a278-44e0-ace1-abd3100779ab",published:false},
    {...activity,id:"6e5937df-829d-4a6a-9870-09caac6797c5",template:true}
  ],now);
  assert.deepEqual(items,[{
    id:communityCalendarId,title:"Bibliotekskväll",
    start:"2026-11-18T17:00:00.000Z",end:"2026-11-18T19:00:00.000Z",
    place:"Biblioteksgatan 1",organizer:"Biblioteket",
    source:"https://goteborg.se/wps/portal/kalendarium/kalendarium-start?activityId="+communityCalendarId
  }]);
});

test("Stockholm summer time and invalid clock changes are handled",()=>{
  const activity={id:communityCalendarId,title:"Sommarträff",startTime:"2026-06-01T18:00:00"};
  assert.equal(cityEvents([activity],0)[0].start,"2026-06-01T16:00:00.000Z");
  assert.deepEqual(cityEvents([{...activity,startTime:"2026-03-29T02:30:00"}],0),[]);
  assert.deepEqual(cityEvents([{...activity,id:"invalid"}],0),[]);
});
