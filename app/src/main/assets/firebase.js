"use strict";

const hangaCloud = (() => {
  const initial = window.HANGA_FIREBASE || {};
  function stored(name) {
    try { return JSON.parse(localStorage.getItem(name)||"null"); } catch { return null; }
  }
  const connectionKey = "hangaFirebaseConnection";
  const authKey = "hangaFirebaseAuth";
  let config = stored(connectionKey) || {url:initial.url||"",key:initial.key||""};
  let credentials = stored(authKey);
  let refreshRequest;
  let revision = 0;
  localStorage.removeItem("hangaConnection");
  localStorage.removeItem("hangaAuth");

  function forget() {
    revision++;
    credentials = null;
    refreshRequest = null;
    localStorage.removeItem(authKey);
  }
  function save(result,ready) {
    const access = result.idToken || result.id_token;
    const refresh = result.refreshToken || result.refresh_token;
    if (!access || !refresh) throw new Error("badLogin");
    credentials = {access,refresh,ready,expires:Date.now()+1000*Number(result.expiresIn||result.expires_in||3600)};
    localStorage.setItem(authKey,JSON.stringify(credentials));
  }
  const messages = {
    INVALID_LOGIN_CREDENTIALS:"badLogin",INVALID_PASSWORD:"badLogin",EMAIL_NOT_FOUND:"badLogin",
    USER_DISABLED:"blocked",EMAIL_EXISTS:"emailUsed",WEAK_PASSWORD:"password",TOO_MANY_ATTEMPTS_TRY_LATER:"mailRate",
    INVALID_REFRESH_TOKEN:"loginRequired",TOKEN_EXPIRED:"loginRequired",INVALID_ID_TOKEN:"loginRequired",
    PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password",USER_NOT_FOUND:"loginRequired",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"reauth",OPERATION_NOT_ALLOWED:"schemaMissing"
  };
  const errors = new Set(["invalid","loginRequired","blocked","forbidden","missing","past","full","reauth","adult",
    "closed","quickTime","seatAvailable","cancelled","messageBlocked","reported","confirmEmail","schemaMissing","server","authDeletion","nameTaken"]);

  async function call(url, body, access, locale) {
    const headers = {"Content-Type":body instanceof URLSearchParams?"application/x-www-form-urlencoded":"application/json"};
    if (locale) headers["X-Firebase-Locale"]=locale;
    if (access) headers.Authorization = "Bearer "+access;
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),20000);
    let response, raw;
    try {
      response = await fetch(url,{method:"POST",headers,body:body instanceof URLSearchParams?body:JSON.stringify(body),
        signal:controller.signal,redirect:"error",credentials:"omit"});
      raw = await response.text();
    } catch { throw new Error("network"); }
    finally { clearTimeout(timeout); }
    let result;
    try { result=JSON.parse(raw); } catch { throw new Error("server"); }
    if (response.ok) return result;
    const code = typeof result.error==="string" ? result.error : result.error?.message?.split(" : ")[0];
    const error = new Error(errors.has(code)?code:messages[code] || (response.status===429?"mailRate":"server"));
    error.providerCode=code;
    throw error;
  }

  function auth(action, body, locale=action==="sendOobCode"?"sv":undefined) {
    return call("https://identitytoolkit.googleapis.com/v1/accounts:"+action+"?key="+encodeURIComponent(config.key),body,undefined,locale);
  }
  function rpc(action, payload={}, access) {
    return call(config.url+"/rpc",{action,payload},access);
  }
  function signIn(email,password) {
    return auth("signInWithPassword",{email,password,returnSecureToken:true});
  }
  function verifyEmail(idToken) { return auth("sendOobCode",{requestType:"VERIFY_EMAIL",idToken}); }
  async function accessToken() {
    if (!credentials) return undefined;
    if (credentials.expires>Date.now()+45000) return credentials.access;
    if (!refreshRequest) {
      const current=revision;
      const ready=credentials.ready;
      const request=call("https://securetoken.googleapis.com/v1/token?key="+encodeURIComponent(config.key),
        new URLSearchParams({grant_type:"refresh_token",refresh_token:credentials.refresh}))
        .then(next=>{
          if (revision!==current) throw new Error("loginRequired");
          save(next,ready);
          return credentials.access;
        }).catch(error=>{
          if (revision===current && ["loginRequired","badLogin","blocked"].includes(error.message)) {
            forget();
            throw new Error("loginRequired");
          }
          throw error;
        }).finally(()=>{if (refreshRequest===request) refreshRequest=null;});
      refreshRequest=request;
    }
    return refreshRequest;
  }

  async function request(path,data) {
    if (path==="/register") {
      if (!data.adult) throw new Error("adult");
      if (!(await rpc("registration")).registration) throw new Error("closed");
      const email=data.email.trim().toLowerCase();
      if (!data.name.trim() || data.name.trim().length>80) throw new Error("invalid");
      const result=await auth("signUp",{email,password:data.password,returnSecureToken:true});
      try {
        await rpc("onboard",{name:data.name,area:data.area,languages:data.languages,adult:true},result.idToken);
      } catch (error) {
        try { await auth("delete",{idToken:result.idToken}); } catch {}
        throw error;
      }
      save(result,false);
      await verifyEmail(result.idToken);
      return {confirmation:email};
    }
    if (path==="/login") {
      const email=data.email.trim().toLowerCase();
      const result=await signIn(email,data.password);
      try {
        const profile=await rpc("me",{},result.idToken);
        save(result,true);
        return {token:"firebase",user:profile};
      } catch (error) {
        if (error.message!=="confirmEmail") throw error;
        save(result,false);
        return {confirmation:email};
      }
    }
    if (path==="/password/reset") {
      try {
        await auth("sendOobCode",{requestType:"PASSWORD_RESET",email:data.email.trim().toLowerCase()},data.locale==="en"?"en":"sv");
      } catch (error) {
        if (error.providerCode!=="EMAIL_NOT_FOUND") throw error;
      }
      return {};
    }
    if (path==="/resend") {
      const access=await accessToken();
      if (!access) throw new Error("loginRequired");
      return verifyEmail(access);
    }
    if (path==="/logout") { forget(); return {}; }
    const access=credentials?.ready ? await accessToken() : undefined;
    if (path==="/me" && data) {
      const profile=await rpc("me",{},access);
      const email=data.email.trim().toLowerCase();
      let active=access;
      if (email!==profile.email || data.newPassword) {
        const verified=await signIn(profile.email,data.current);
        save(verified,true);
        active=verified.idToken;
        if (data.newPassword) {
          const updated=await auth("update",{idToken:active,password:data.newPassword,returnSecureToken:true});
          save(updated,true);
          active=updated.idToken;
        }
        if (email!==profile.email) {
          await auth("sendOobCode",{requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:active,newEmail:email});
        }
      }
      const updated=await rpc("profile",{
        name:data.name,area:data.area,bio:data.bio,interests:data.interests,languages:data.languages
      },active);
      return {...updated,emailPending:updated.email!==email};
    }
    if (path==="/account/delete") {
      const verified=await signIn(data.email,data.password);
      await rpc("delete_account",{},verified.idToken);
      forget();
      return {};
    }
    const routes={"/availability":data?"availability_save":"availability_list","/follows":data?"follow_change":"follow_list",
      "/groups":"group_messages","/groups/send":"group_send","/attendance":"attendance","/feedback":data?.save?"feedback_save":"feedback_get",
      "/events":data?"create":"events","/me":"me","/messages":"messages","/chats":"chat_inbox","/chats/read":"chat_read","/chats/delete":"chat_delete","/chats/send":"chat_send","/notices":"notices",
      "/admin":"admin","/admin/settings":"admin_settings","/report":"report","/blocks":"block_list",
      "/blocks/change":"block_person","/reports/resolve":"resolve_report","/push/register":"push_register","/alerts/on":"alerts_on","/alerts/off":"alerts_off"};
    if (routes[path]) return rpc(routes[path],data||{},access);
    const member=path.match(/^\/members\/(\d+)$/);
    if (member) return rpc("member_profile",{id:Number(member[1])},access);
    const event=path.match(/^\/events\/(\d+)\/(edit|delete|moderate|join|save|participants|message|cancel|waitlist)$/);
    if (event) return rpc(event[2]==="delete"?"delete_event":event[2],{...data,id:Number(event[1])},access);
    const account=path.match(/^\/admin\/users\/(\d+)\/(block|delete)$/);
    if (account) return rpc("admin_"+account[2],{...data,id:Number(account[1])},access);
    throw new Error("missing");
  }

  async function connect(raw,key) {
    let url;
    try { url=new URL(raw.trim()); } catch { throw new Error("invalidConnection"); }
    if (url.protocol!=="https:" || !/^(?:[a-z0-9-]+\.){2}workers\.dev$/.test(url.hostname) ||
        url.port || url.username || url.password || url.pathname!=="/" || url.search || url.hash ||
        !/^AIza[A-Za-z0-9_-]{35}$/.test(key)) throw new Error("invalidConnection");
    const next={url:url.origin,key};
    const check=await call(next.url+"/rpc",{action:"health"});
    if (check?.service!=="Hanga Gbg Firebase" || check.version!==1 || check.apiKey!==key) throw new Error("schemaMissing");
    if (next.url!==config.url || next.key!==config.key) forget();
    config=next;
    localStorage.setItem(connectionKey,JSON.stringify(next));
  }
  return {request,connect,forget,get configuration(){return config;},get signedIn(){return credentials?.ready===true;}};
})();
