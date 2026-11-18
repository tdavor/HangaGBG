import test from "node:test";
import assert from "node:assert/strict";
import {sendChatPush} from "../push.mjs";

test("push sends only routing data to recipient devices, once per valid token",async()=>{
  const valid={expires:Date.now()+60000,fcmToken:"valid-installation"};
  const db={async query(collection,filter) {
    assert.equal(collection,"devices");
    assert.deepEqual(filter,[["user_id","EQUAL",2]]);
    return [valid,valid,{expires:0,fcmToken:"expired"},{expires:valid.expires}];
  }};
  let calls=0;
  await sendChatPush(db,{FIREBASE_PROJECT:"test"},"access",{owner:2,peer:3,notice:4,body:"private"},async(url,request)=>{
    calls++;
    assert.equal(url,"https://fcm.googleapis.com/v1/projects/test/messages:send");
    assert.equal(request.headers.Authorization,"Bearer access");
    assert.deepEqual(JSON.parse(request.body),{message:{token:"valid-installation",
      data:{kind:"chat",owner:"2",peer:"3",notice:"4"},android:{priority:"HIGH",ttl:"3600s"}}});
    return new Response(null,{status:200});
  });
  assert.equal(calls,1);
});
