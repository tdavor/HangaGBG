const encoder = new TextEncoder();
const tokens = new Map();
const b64 = bytes => btoa(String.fromCharCode(...bytes)).replaceAll("+","-").replaceAll("/","_").replace(/=+$/,"");

export async function googleToken(env) {
  const account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT);
  const cached = tokens.get(account.client_email);
  if (cached && cached.expires > Date.now()) return cached.value;
  const now = Math.floor(Date.now()/1000);
  const jwt = [ {alg:"RS256",typ:"JWT"}, {
    iss:account.client_email, aud:"https://oauth2.googleapis.com/token", iat:now, exp:now+3600,
    scope:"https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/firebase.messaging"
  } ].map(part => b64(encoder.encode(JSON.stringify(part)))).join(".");
  const pem = account.private_key.replace(/-----[^-]+-----|\s/g,"");
  const key = await crypto.subtle.importKey("pkcs8",Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),
    {name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,encoder.encode(jwt));
  const response = await fetch("https://oauth2.googleapis.com/token",{
    method:"POST",body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:jwt+"."+b64(new Uint8Array(signature))})
  });
  if (!response.ok) throw new Error("googleToken");
  const {access_token,expires_in} = await response.json();
  tokens.set(account.client_email,{value:access_token,expires:Date.now()+(expires_in-90)*1000});
  return access_token;
}

function value(data) {
  if (data===null) return {nullValue:null};
  if (typeof data==="string") return {stringValue:data};
  if (typeof data==="boolean") return {booleanValue:data};
  if (typeof data==="number" && Number.isSafeInteger(data)) return {integerValue:String(data)};
  if (Array.isArray(data)) return {arrayValue:{values:data.map(value)}};
  return {mapValue:{fields:fields(data)}};
}
const fields = object => Object.fromEntries(Object.entries(object).map(([key,item])=>[key,value(item)]));
function decode(data) {
  if ("integerValue" in data) return Number(data.integerValue);
  if ("arrayValue" in data) return (data.arrayValue.values||[]).map(decode);
  if ("mapValue" in data) return object(data.mapValue.fields);
  return Object.values(data)[0];
}
const object = (data={}) => Object.fromEntries(Object.entries(data).map(([k,v])=>[k,decode(v)]));

export class Store {
  constructor(project, token) {
    this.root = `projects/${project}/databases/(default)/documents`;
    this.url = "https://firestore.googleapis.com/v1/"+this.root;
    this.token = token;
    this.writes = new Map();
  }
  async send(path, body) {
    const response = await fetch(this.url+path,{
      method:"POST",headers:{Authorization:"Bearer "+this.token,"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.status||"firestore");
    return result;
  }
  async getMany(collection, ids) {
    const keys = [...new Set(ids)].filter(id=>id!==null && id!==undefined);
    if (!keys.length) return new Map();
    const rows = await this.send(":batchGet",{
      documents:keys.map(id=>`${this.root}/${collection}/${id}`),
      ...(this.transaction ? {transaction:this.transaction} : {})
    });
    return new Map(rows.filter(row=>row.found).map(({found})=>[found.name.split("/").pop(),object(found.fields)]));
  }
  async get(collection,id) { return (await this.getMany(collection,[id])).get(String(id)); }
  async query(collection, filters=[], order, limit) {
    const terms = filters.map(([fieldPath,op,data])=>({fieldFilter:{field:{fieldPath},op,value:value(data)}}));
    const query = {from:[{collectionId:collection}]};
    if (terms.length) query.where = terms.length===1 ? terms[0] : {compositeFilter:{op:"AND",filters:terms}};
    if (order) query.orderBy = [{field:{fieldPath:order[0]},direction:order[1]}];
    if (limit) query.limit = limit;
    const rows = await this.send(":runQuery",{structuredQuery:query,...(this.transaction?{transaction:this.transaction}:{})});
    return rows.filter(row=>row.document).map(row=>object(row.document.fields));
  }
  put(collection,id,data) {
    const name = `${this.root}/${collection}/${id}`;
    this.writes.set(name,{update:{name,fields:fields(data)}});
  }
  remove(collection,id) {
    const name = `${this.root}/${collection}/${id}`;
    this.writes.set(name,{delete:name});
  }
  async run(fn, mutable) {
    if (!mutable) return fn(this);
    for (let attempt=0;attempt<3;attempt++) {
      this.writes.clear();
      this.transaction = (await this.send(":beginTransaction",{options:{readWrite:{}}})).transaction;
      try {
        const result = await fn(this);
        await this.send(":commit",{transaction:this.transaction,writes:[...this.writes.values()]});
        return result;
      } catch (error) {
        try { await this.send(":rollback",{transaction:this.transaction}); } catch {}
        if (error.message!=="ABORTED" || attempt===2) throw error;
      } finally { this.transaction = undefined; }
    }
  }
}
