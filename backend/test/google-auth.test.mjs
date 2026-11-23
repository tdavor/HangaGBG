import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
const source=readFileSync(new URL('../../app/src/main/assets/firebase.js',import.meta.url),'utf8');
function client(handler,{account}={}) {
  const storage=new Map();
  if(account)storage.set('hangaFirebaseAuth',JSON.stringify({access:'old-firebase',refresh:'refresh',ready:true,provider:'google.com',uid:'original',expires:Date.now()+3600000}));
  const calls=[];
  const context={URL,URLSearchParams,AbortController,Date,crypto:webcrypto,setTimeout,clearTimeout,
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    window:{HANGA_FIREBASE:{url:'https://example.workers.dev',key:'test'},HangaAndroid:{googleSignInAvailable:()=>true,googleSignIn(id){queueMicrotask(()=>context.window.hangaGoogleResult(id,'google-token',''));},googleSignOut(){}}},
    async fetch(url,options){const body=JSON.parse(options.body);calls.push({url,body});const result=await handler(url,body,calls);return {ok:!result.error,status:result.error?400:200,text:async()=>JSON.stringify(result)};}};
  vm.createContext(context);vm.runInContext(source,context);
  return {api:vm.runInContext('hangaCloud',context),calls,storage,context};
}
const authResult={localId:'original',idToken:'firebase-google',refreshToken:'refresh-google',expiresIn:'3600',providerId:'google.com'};
test('Google token is exchanged by Firebase and an existing profile is reused',async()=>{
  const {api,calls}=client((url,body)=>url.includes('signInWithIdp')?authResult:{id:42,name:'Anna',email:'private@example.test'});
  const result=await api.request('/google/login',{});
  assert.equal(result.user.id,42);assert.equal(api.signedIn,true);assert.equal(api.googleAccount,true);
  assert.equal(new URLSearchParams(calls[0].body.postBody).get('providerId'),'google.com');
  assert.equal(new URLSearchParams(calls[0].body.postBody).get('id_token'),'google-token');
  assert.equal(calls[1].body.action,'me');assert.equal(calls.some(x=>x.body.action==='onboard'),false);
});
test('new Google users must complete a unique profile and adult confirmation',async()=>{
  let completed=false;
  const {api,calls}=client((url,body)=>{
    if(url.includes('signInWithIdp'))return authResult;
    if(body.action==='me')return completed?{id:42,name:'Anna'}:{error:'loginRequired'};
    if(body.action==='onboard'){if(body.payload.name==='Taken')return {error:'nameTaken'};completed=true;return {id:42};}
  });
  assert.equal((await api.request('/google/login',{})).onboarding,true);
  assert.equal(api.signedIn,false);assert.equal(api.needsGoogleProfile,true);
  await assert.rejects(api.request('/google/complete',{name:'Anna'}),{message:'adult'});
  await assert.rejects(api.request('/google/complete',{name:'Taken',area:'Haga',adult:true}),{message:'nameTaken'});
  assert.equal(api.signedIn,false);
  await api.request('/google/complete',{name:'Anna',area:'Haga',languages:'Svenska',adult:true});
  assert.equal(api.signedIn,true);assert.equal(calls.filter(x=>x.body.action==='onboard').length,2);
});
test('Google account conflicts do not create a second profile or save credentials',async()=>{
  const {api,calls,storage}=client(()=>({needConfirmation:true,email:'existing@example.test'}));
  await assert.rejects(api.request('/google/login',{}),{message:'googleAccountExists'});
  assert.equal(calls.length,1);assert.equal(storage.has('hangaFirebaseAuth'),false);assert.equal(api.signedIn,false);
});
test('Google deletion reauthenticates the same Firebase UID without a password',async()=>{
  const {api,calls}=client((url,body)=>url.includes('lookup')?{users:[{localId:'original'}]}:url.includes('signInWithIdp')?authResult:{},{account:true});
  await api.request('/account/delete',{email:'private@example.test'});
  assert.equal(calls.at(-1).body.action,'delete_account');assert.equal(api.signedIn,false);
  assert.equal(calls.some(x=>x.url.includes('signInWithPassword')),false);
});
test('selecting a different Google account cannot delete the signed-in account',async()=>{
  const {api,calls}=client(url=>url.includes('lookup')?{users:[{localId:'original'}]}:{...authResult,localId:'different'},{account:true});
  await assert.rejects(api.request('/account/delete',{}),{message:'googleWrongAccount'});
  assert.equal(calls.some(x=>x.body.action==='delete_account'),false);assert.equal(api.signedIn,true);
});
test('cancelled and stale native replies never create a session',async()=>{
  const {api,calls,context}=client(()=>authResult);
  context.window.HangaAndroid.googleSignIn=id=>queueMicrotask(()=>{
    context.window.hangaGoogleResult('unrelated-request','token','');
    context.window.hangaGoogleResult(id,'','googleCancelled');
  });
  await assert.rejects(api.request('/google/login',{}),{message:'googleCancelled'});
  assert.equal(calls.length,0);assert.equal(api.signedIn,false);
});

test('logout while a Google profile is loading cannot restore the session',async()=>{
  let release,entered;
  const started=new Promise(r=>entered=r);
  const pending=new Promise(r=>release=r);
  const {api}=client(async(url,body)=>{
    if(url.includes('signInWithIdp'))return authResult;
    entered();await pending;return {id:42};
  });
  const login=api.request('/google/login',{});
  await started;await api.request('/logout',{});release();
  await assert.rejects(login,{message:'loginRequired'});
  assert.equal(api.signedIn,false);assert.equal(api.needsGoogleProfile,false);
});

test('a second Google login cannot race while Firebase profile lookup is still running',async()=>{
 let finish,entered;
 const ready=new Promise(resolve=>entered=resolve),pending=new Promise(resolve=>finish=resolve);
 const {api,calls}=client(async url=>{if(url.includes('signInWithIdp'))return authResult;entered();await pending;return {id:42,name:'Anna'};});
 const first=api.request('/google/login',{});await ready;
 await assert.rejects(api.request('/google/login',{}),{message:'googleBusy'});
 assert.equal(calls.filter(c=>c.url.includes('signInWithIdp')).length,1);
 finish();assert.equal((await first).user.id,42);assert.equal(api.signedIn,true);
});
test('failed Google profile lookup releases the operation lock for an explicit retry',async()=>{
 let fail=true;
 const {api}=client(url=>url.includes('signInWithIdp')?authResult:fail?{error:'server'}:{id:42});
 await assert.rejects(api.request('/google/login',{}),{message:'server'});fail=false;
 assert.equal((await api.request('/google/login',{})).user.id,42);
});
test('Google timeout cancels only the pending prompt, keeps an existing session and ignores late results',async()=>{
 const {api,calls,context}=client(()=>authResult,{account:true});
 let timeout,prompt,cancelled=0,signedOut=0;
 context.setTimeout=(fn,ms)=>{assert.equal(ms,120000);timeout=fn;return 1;};context.clearTimeout=()=>{};
 context.window.HangaAndroid.googleSignIn=id=>{prompt=id;};
 context.window.HangaAndroid.googleCancel=()=>cancelled++;
 context.window.HangaAndroid.googleSignOut=()=>signedOut++;
 const login=api.request('/google/login',{});timeout();
 await assert.rejects(login,{message:'googleTimeout'});
 context.window.hangaGoogleResult(prompt,'late-token','');
 assert.equal(cancelled,1);assert.equal(signedOut,0);assert.equal(calls.length,0);assert.equal(api.signedIn,true);
});
