import {Store,googleToken} from "./firestore.mjs";
import {action,reads} from "./actions.mjs";
import {sendWelcome} from "./welcome.mjs";
import {sendChatPush} from "./push.mjs";
import {pendingPrompts} from "./community.mjs";
import {cityCalendar} from "./city-events.mjs";

const headers = {"Content-Type":"application/json","Cache-Control":"no-store",
  "Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":"Authorization, Content-Type"};
const reply = (body,status=200) => new Response(JSON.stringify(body),{status,headers});
const errors = new Set(["invalid","loginRequired","blocked","forbidden","missing","past","full","reauth","adult",
  "closed","quickTime","seatAvailable","cancelled","messageBlocked","reported","confirmEmail","schemaMissing","authDeletion","nameTaken"]);

async function identity(request,env) {
  const authorization=request.headers.get("Authorization");
  if (!authorization) return null;
  const idToken=authorization.match(/^Bearer ([\w.-]{1,8192})$/)?.[1];
  if (!idToken) throw new Error("loginRequired");
  let claims;
  try {
    const encoded=idToken.split(".")[1].replaceAll("-","+").replaceAll("_","/");
    claims=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))));
  } catch { throw new Error("loginRequired"); }
  if (claims.aud!==env.FIREBASE_PROJECT || claims.iss!=="https://securetoken.google.com/"+env.FIREBASE_PROJECT ||
      !/^[A-Za-z0-9_-]{1,128}$/.test(claims.sub||"")) throw new Error("loginRequired");
  // Firebase verifies the signed token, revocation and account before claims are trusted.
  const response=await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+env.FIREBASE_API_KEY,{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken})
  });
  if (response.status>=500 || response.status===429) throw new Error("authUnavailable");
  if (!response.ok) throw new Error("loginRequired");
  const user=(await response.json()).users?.[0];
  if (!user || user.disabled || user.localId!==claims.sub) throw new Error("loginRequired");
  return {uid:user.localId,email:user.email,verified:user.emailVerified===true,
    authTime:claims.auth_time,provider:claims.firebase?.sign_in_provider};
}

async function deleteAuth(env,token,uid,idToken) {
  const url=idToken ? "https://identitytoolkit.googleapis.com/v1/accounts:delete?key="+encodeURIComponent(env.FIREBASE_API_KEY)
    : `https://identitytoolkit.googleapis.com/v1/projects/${env.FIREBASE_PROJECT}/accounts:delete`;
  const headers={"Content-Type":"application/json"};
  if (!idToken) headers.Authorization="Bearer "+token;
  const response=await fetch(url,{method:"POST",headers,
    body:JSON.stringify(idToken?{idToken}:{localId:uid})});
  if (!response.ok && (await response.json()).error?.message!=="USER_NOT_FOUND") throw new Error("authDeletion");
}

export async function removeEventRelations(db,id) {
  for (const collection of ["plans","group_messages","feedback","again_choices","again_matches","again_pairs"]) {
    while (true) {
      const rows=await db.query(collection,[["event_id","EQUAL",id]],null,200);
      if (!rows.length) break;
      db.writes.clear();
      for (const row of rows) db.remove(collection,["plans","feedback"].includes(collection)?id+"-"+row.user_id:row.id);
      await db.send(":commit",{writes:[...db.writes.values()]});
    }
  }
}

export default {
  async scheduled(controller,env,ctx) {
    const token=await googleToken(env);
    const db=new Store(env.FIREBASE_PROJECT,token);
    const events=await db.query("events",[
      ["start","GREATER_THAN",new Date(Date.now()-15*86400000).toISOString()],
      ["start","LESS_THAN",new Date(Date.now()+86400000).toISOString()]
    ]);
    for(const event of await pendingPrompts(db,events)) await db.run(store=>action(store,"due_notices",{id:event.id},null,env),true);
  },
  async fetch(request,env,ctx) {
    if (request.method==="OPTIONS") return new Response(null,{status:204,headers});
    const path=new URL(request.url).pathname;
    if (request.method==="GET" && path==="/city-events") {
      try { return await cityCalendar(request,ctx,headers); }
      catch { return reply({error:"server"},503); }
    }
    if (request.method!=="POST" || !["/rpc","/alerts"].includes(path)) return reply({error:"missing"},404);
    try {
      if (Number(request.headers.get("Content-Length"))>70000) throw new Error("invalid");
      const raw=await request.text();
      if (raw.length>70000) throw new Error("invalid");
      let input;
      try { input=JSON.parse(raw); } catch { throw new Error("invalid"); }
      const name=path==="/alerts"?"poll":input?.action;
      if(name!=="profile_photo"&&raw.length>16384)throw new Error("invalid");
      const p=path==="/alerts"?input:(input?.payload??{});
      if (!p || typeof p!=="object" || Array.isArray(p) || !/^[a-z_]{1,24}$/.test(name||"")) throw new Error("invalid");
      if (name==="due_notices" || (name==="poll" && path!=="/alerts")) throw new Error("missing");
      if (!/^[a-z][a-z0-9-]{4,29}$/.test(env.FIREBASE_PROJECT||"") || !env.FIREBASE_API_KEY || !env.GOOGLE_SERVICE_ACCOUNT) throw new Error("schemaMissing");
      const caller=path==="/alerts"?null:await identity(request,env);
      const token=await googleToken(env);
      const db=new Store(env.FIREBASE_PROJECT,token);
      if (name==="health") {
        await db.get("settings","app");
        return reply({service:"Hanga Gbg Firebase",version:1,eventDeletion:"permanent",apiKey:env.FIREBASE_API_KEY});
      }
      const result=await db.run(store=>action(store,name,p,caller,env),!reads.has(name));
      if (result.pushChat) {
        ctx.waitUntil(sendChatPush(db,env,token,result.pushChat).catch(error=>
          console.error("Chat push delivery failed:",error.message)));
        return reply({});
      }
      if (result.deleteAuth) {
        await deleteAuth(env,token,result.deleteAuth,
          name==="delete_account"?request.headers.get("Authorization").slice(7):undefined);
        db.writes.clear();
        db.remove("identities",result.deleteAuth);
        db.remove("profiles",result.profileId);
        await db.send(":commit",{writes:[...db.writes.values()]});
        return reply({});
      }
      if (result.removedEvent) {
        ctx.waitUntil(removeEventRelations(db,result.removedEvent).catch(error=>
          console.error("Event cleanup failed:",error.message)));
        return reply({});
      }
      if (name==="onboard" && result.newRegistration) {
        const {newRegistration,...profile}=result;
        ctx.waitUntil(sendWelcome(env,caller).catch(error=>console.error("Welcome email failed:",error.message)));
        return reply(profile);
      }
      return reply(result);
    } catch(error) {
      const code=errors.has(error.message)?error.message:"server";
      if (code==="server") console.error("Hänga GBG backend:",error.message);
      return reply({error:code},code==="server"||code==="schemaMissing"?503:code==="forbidden"?403:code==="loginRequired"?401:400);
    }
  }
};
