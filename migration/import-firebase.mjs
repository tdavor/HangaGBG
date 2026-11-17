import {readFile} from "node:fs/promises";
import {applicationDefault,initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

const [, , filename, project, option] = process.argv;
if (!filename || !/^[a-z][a-z0-9-]{4,29}$/.test(project||"") || !["--check","--apply"].includes(option)) {
  throw new Error("Usage: node migration/import-firebase.mjs backup.json project-id --check|--apply");
}
const data=JSON.parse(await readFile(filename,"utf8"));
const {users,profiles,events,plans,waitlist,messages,notices,blocks,reports}=data;
const byUid=new Map(users.map(u=>[u.uid,u]));
const emails=new Set();
for (const user of users) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(user.uid) || !user.email || emails.has(user.email.toLowerCase()) ||
      !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.hash||"")) {
    throw new Error("Source user IDs, unique email addresses and BCRYPT password hashes are required.");
  }
  emails.add(user.email.toLowerCase());
}
if (profiles.length!==users.length || byUid.size!==users.length || profiles.some(p=>!byUid.has(p.auth_id))) {
  throw new Error("Source identity/profile mismatch.");
}
const ids=[...profiles,...events,...messages,...notices,...reports].map(row=>row.id);
if (ids.some(id=>!Number.isSafeInteger(id)||id<1)) throw new Error("Source contains an invalid numeric ID.");

const rows=[];
const put=(collection,id,document)=>rows.push({collection,id:String(id),document});
const joinedCount=new Map();
const allPlans=new Map();
for (const plan of plans) {
  allPlans.set(plan.event_id+"-"+plan.user_id,{...plan,waitlisted:false});
  if (plan.joined) joinedCount.set(plan.event_id,(joinedCount.get(plan.event_id)||0)+1);
}
for (const plan of waitlist) {
  const key=plan.event_id+"-"+plan.user_id;
  allPlans.set(key,{...(allPlans.get(key)||{...plan,joined:false,saved:false}),waitlisted:true});
}
for (const {auth_id,...profile} of profiles) {
  put("profiles",profile.id,{...profile,uid:auth_id,email:byUid.get(auth_id).email});
  put("identities",auth_id,{id:profile.id});
}
const eventTitles=new Map();
for (const event of events) {
  put("events",event.id,{...event,start:new Date(event.start).toISOString(),count:joinedCount.get(event.id)||0});
  eventTitles.set(event.id,event.title);
}
for (const [key,plan] of allPlans) put("plans",key,plan);
for (const m of messages) put("messages",m.id,m);
for (const {user_id,...notice} of notices) {
  if (eventTitles.has(notice.event_id)) put("notices",notice.id,{...notice,title:eventTitles.get(notice.event_id),recipients:[user_id]});
}
for (const b of blocks) put("blocks",b.blocker+"-"+b.blocked,b);
for (const r of reports) put("reports",r.id,r);
put("settings","app",{registration:data.registration!==false});
put("settings","sequence",{last:ids.reduce((a,b)=>Math.max(a,b),0)});
console.log(`${users.length} users, ${events.length} events, ${rows.length} Firestore documents validated.`);
if (option==="--check") process.exit(0);

const app=initializeApp({credential:applicationDefault(),projectId:project});
const auth=getAuth(app);
const db=getFirestore(app);
const marker=db.doc("migration/supabase-v1");
let state=(await marker.get()).data();
const {createHash}=await import("node:crypto");
const fingerprint=createHash("sha256").update(await readFile(filename)).digest("hex");
if (state?.source && state.source!==fingerprint) throw new Error("Use the original backup to resume.");
if (state?.complete) throw new Error("This backup was already imported.");
if (!state) {
  const [accounts,collections]=await Promise.all([auth.listUsers(1),db.listCollections()]);
  if (accounts.users.length || collections.length) throw new Error("The destination must be empty.");
  state={source:fingerprint,complete:false};
  await marker.create(state);
}
for (let offset=0;offset<users.length;offset+=100) {
  const group=users.slice(offset,offset+100);
  const existing=await auth.getUsers(group.map(user=>({uid:user.uid})));
  const missing=new Set(existing.notFound.map(item=>item.uid));
  const batch=group.filter(user=>missing.has(user.uid)).map(user=>({uid:user.uid,email:user.email,
    emailVerified:user.verified===true,disabled:user.disabled===true,passwordHash:Buffer.from(user.hash)}));
  if (batch.length) {
    const result=await auth.importUsers(batch,{hash:{algorithm:"BCRYPT"}});
    if (result.failureCount) throw new Error("Firebase rejected part of an Auth batch. Resolve the import error before resuming.");
  }
}
for (let offset=0;offset<rows.length;offset+=200) {
  const batch=db.batch();
  for (const {collection,id,document} of rows.slice(offset,offset+200)) batch.set(db.collection(collection).doc(id),document);
  await batch.commit();
}
await marker.update({complete:true});
console.log("Import finished.");
