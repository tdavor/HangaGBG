export async function sendChatPush(db, env, access, push, send=fetch) {
  const devices=await db.query("devices",[["user_id","EQUAL",push.owner]]);
  const tokens=[...new Set(devices.filter(device=>device.expires>Date.now()&&device.fcmToken).map(device=>device.fcmToken))];
  const endpoint=`https://fcm.googleapis.com/v1/projects/${env.FIREBASE_PROJECT}/messages:send`;
  const results=await Promise.allSettled(tokens.slice(0,20).map(async token=>{
    const response=await send(endpoint,{
      method:"POST",headers:{Authorization:"Bearer "+access,"Content-Type":"application/json"},
      signal:AbortSignal.timeout(8000),body:JSON.stringify({message:{token,
        data:{kind:"chat",owner:String(push.owner),peer:String(push.peer),notice:String(push.notice)},
        android:{priority:"HIGH",ttl:"3600s"}
      }})
    });
    if (response.ok) return;
    const payload=await response.json().catch(()=>({}));
    if (payload.error?.details?.some(detail=>detail.errorCode==="UNREGISTERED")) return;
    throw new Error("FCM HTTP "+response.status);
  }));
  const failed=results.find(result=>result.status==="rejected");
  if (failed) throw failed.reason;
}
