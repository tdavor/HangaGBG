"use strict";

const copy = {
  cityCalendar:["Göteborgs Stad","City of Gothenburg"],
  cityCalendarUnavailable:["Stadens kalendarium är tillfälligt otillgängligt.","The city calendar is temporarily unavailable."],
  eventSource:["Visa träffar från","Show events from"],
  communityEvents:["Hänga Gbg","Hänga Gbg"],
  arrangeCityMeetup:["Ordna en träff","Arrange a meetup"],
  cityMeetups:["Träffar för evenemanget","Meetups for this event"],
  cityMeetupHelp:["Välj tid och mötesplats. Efter publicering kan du bjuda in andra och skriva till deltagare i Hänga Gbg. Kontrollera eventuell bokning på Göteborgs Stads webbplats.","Choose a time and meeting point. After publishing, invite others and message participants in Hänga Gbg. Check any booking requirements on the city website."],
  cityShare:["Dela / bjud in","Share / invite"],
  cityInvite:["Vill du följa med?","Want to come along?"],
  preferences:["Inställningar","Settings"], interfaceLanguage:["Appens språk","App language"],
  contact:["Kontakta Hänga Gbg","Contact Hänga Gbg"], expired:["Avslutade träffar","Past meetups"],
  repeat:["Skapa en ny träff från denna","Repeat this meetup"], deleteEvent:["Ta bort träffen","Delete meetup"],
  keepMeetup:["Behåll träffen","Keep meetup"],
  eventDeleted:["Träffen togs bort.","The meetup was deleted."],
  eventDeleteIncomplete:["Träffen finns fortfarande kvar. Försök igen eller kontakta support.","The meetup is still listed. Try again or contact support."],
  confirmEventDelete:["Ta bort träffen permanent?","Permanently delete this meetup?"],
  passwordShow:["Visa lösenord","Show password"], passwordHide:["Dölj lösenord","Hide password"],
  alertsFailed:["Det gick inte att starta aviseringar. Försök igen.","Couldn't start notifications. Try again."],
  authDeletion:["Kontot kunde inte tas bort. Försök igen.","The account couldn't be deleted. Try again."],
  walk:["Promenader","Walks"],
  reminderTitle:["Påminnelse","Reminder"], reminderMinutes:["Minuter före start","Minutes before start"],
  reminderOff:["Ingen påminnelse","No reminder"], preciseReminder:["Tillåt exakta påminnelser","Allow precise reminders"],
  allowReminder:["Tillåt Android-aviseringar","Allow Android notifications"],
  reminderNote:["Standard: 120 minuter före start. Inställningen gäller på den här enheten.",
    "Default: 120 minutes before the start. This setting applies on this device."],
  browseEvents:["Kommande träffar","Upcoming meetups"], searchFilters:["Sök och filtrera","Search and filter"],
  previous:["Föregående","Previous"], next:["Nästa","Next"], page:["Sida","Page"],
  simulateVacancy:["Simulera en ledig plats","Simulate an open spot"],
  quick:["Sugen på att hänga?","Up for hanging out?"], quickBadge:["Spontant","Spontaneous"],
  quickTime:["Välj en tid inom 24 timmar.","Choose a time within the next 24 hours."],
  newcomers:["Nya deltagare välkomna","First-timers welcome"], share:["Dela inbjudan","Share invitation"],
  shareFailed:["Kunde inte dela inbjudan.","Could not share invitation."],
  waitlist:["Gå med i väntelistan","Join waitlist"], leaveWaitlist:["Lämna väntelistan","Leave waitlist"],
  seatAvailable:["En plats är ledig. Uppdatera och anmäl dig.","A spot is available. Refresh and join."],
  vacancy:["En plats har blivit ledig","A spot opened up"], changed:["Tid eller plats har ändrats","Time or place changed"],
  cancelled:["Träffen är inställd","Meetup cancelled"], cancelEvent:["Ställ in träffen","Cancel meetup"],
  confirmCancel:["Vill du ställa in träffen och meddela deltagarna?","Cancel the meetup and notify attendees?"],
  reminder:["Träffen börjar inom en timme","Meetup starts within an hour"],
  report:["Anmäl innehåll","Report content"], reportReason:["Vad vill du anmäla?","What would you like to report?"],
  reported:["Det här har redan anmälts.","You have already reported this."],
  blockPerson:["Blockera meddelanden","Block messages"], unblockPerson:["Avblockera meddelanden","Unblock messages"],
  blockedPeople:["Blockerade konton","Blocked accounts"], messageBlocked:["Meddelanden mellan dessa konton är blockerade.","Messages between these accounts are blocked."],
  reportPerson:["Anmäl konto","Report account"], reportEvent:["Anmäl träff","Report meetup"], reportMessage:["Anmäl meddelande","Report message"],
  eventTemplates:["Förslag att publicera","Starter meetup drafts"],
  templateDate:["Välj datum, tid och exakt mötesplats innan publicering.","Choose a date, time and exact meeting point before publishing."],
  reports:["Anmälningar","Reports"], resolve:["Markera behandlad","Mark resolved"], resolved:["Behandlad","Resolved"],
  alertsOn:["Aktivera Android-aviseringar","Enable Android notifications"], alertsOff:["Stäng av Android-aviseringar","Disable Android notifications"],
  alertsDenied:["Tillåt aviseringar i Android-inställningarna.","Allow notifications in Android settings."],
  checkUpdates:["Sök efter uppdatering","Check for updates"],
  accountMenu:["Kontomeny","Account menu"],
  localAlertsNote:["Nya träffar i ditt sparade område ingår när Android-aviseringar är aktiverade.","Android notifications include new meetups in your saved area."],
  discover:["Upptäck","Discover"], plans:["Mina planer","My plans"], create:["Skapa","Create"],
  messages:["Meddelanden","Messages"], profile:["Mitt konto","My account"], admin:["Adminpanel","Admin panel"],
  notices:["Aviseringar","Notifications"], login:["Logga in","Log in"], register:["Skapa konto","Sign up"],
  logout:["Logga ut","Log out"], settings:["Anslutning","Connection"], browse:["Vad vill du göra i Göteborg?","What are you up for in Gothenburg?"],
  intro:["Hitta något att göra i kväll eller bjud in andra till en egen träff.","Find something to do tonight or invite others to your own meetup."],
  search:["Till exempel: promenad i Haga","For example: a walk in Haga"], keyword:["Vad är du sugen på?","What do you feel like doing?"],
  all:["Alla","All"], today:["I dag","Today"], upcoming:["Kommande","Upcoming"],
  tonight:["Ikväll","Tonight"], anyArea:["Alla områden","All areas"], category:["Kategori","Category"], mood:["Stämning","Mood"],
  area:["Område","Area"], other:["Övrigt","Other"], customArea:["Skriv ditt område","Enter your area"], none:["Inga träffar hittades.","No events found."],
  noPlans:["Du har inga sparade träffar eller anmälningar än.","You have no saved events or RSVPs yet."],
  own:["Mina egna träffar","My meetups"], saved:["Sparade och anmälda","Saved and joined"], savePlan:["Spara","Save"],
  removePlan:["Ta bort sparad","Unsave"], join:["Jag kommer","I’m in"], leave:["Avanmäl","Leave"],
  attendees:["Deltagare","Attendees"], waiting:["Ingen har anmält sig ännu.","Nobody has joined yet."],
  edit:["Redigera","Edit"], delete:["Ta bort","Delete"], confirmDelete:["Vill du ta bort detta permanent?","Permanently delete this?"],
  hide:["Dölj","Hide"], show:["Visa","Show"], hidden:["Dold","Hidden"], block:["Blockera","Block"], unblock:["Avblockera","Unblock"],
  map:["Öppna karta","Open map"], source:["Källa / bokning","Source / booking"], organizer:["Arrangör","Organizer"],
  title:["Titel","Title"], description:["Beskrivning","Description"], place:["Mötesplats eller adress","Meeting place or address"],
  date:["Datum och tid (Göteborg)","Date and time (Gothenburg)"], price:["Pris (kr)","Price (SEK)"], capacity:["Max antal deltagare","Maximum attendees"],
  free:["Gratis","Free"], publish:["Publicera träff","Publish meetup"], save:["Spara ändringar","Save changes"],
  name:["Visningsnamn","Display name"], email:["E-post","Email"], passwordLabel:["Lösenord","Password"],
  newPassword:["Nytt lösenord","New password"], current:["Nuvarande lösenord","Current password"],
  bio:["Om mig","About me"], interests:["Intressen","Interests"], languages:["Språk","Languages"],
  adultLabel:["Jag är minst 18 år","I am at least 18"], deleteAccount:["Ta bort mitt konto","Delete my account"],
  send:["Skicka","Send"], message:["Meddelande","Message"], reply:["Svara","Reply"], noMessages:["Inga meddelanden ännu.","No messages yet."],
  noNotices:["Inga aviseringar ännu.","No notifications yet."],
  registration:["Tillåt registrering","Allow registration"], accounts:["Användare","Users"], events:["Träffar","Events"],
  demo:["Prova demo","Try demo"], details:["Visa detaljer","View details"], connect:["Anslut backend","Connect backend"],
  demoBanner:["Demoläge · Exempelträffar sparas på den här enheten.","Demo mode · Sample events are stored on this device."],
  connectionHelp:["Ange API-adressen och Firebase-projektets webbnyckel.","Enter the API URL and Firebase project’s web API key."],
  url:["Serveradress","Server URL"], refresh:["Uppdatera","Refresh"], done:["Klart","Done"], loading:["Laddar …","Loading …"],
  joined:["har anmält sig","joined your meetup"], messageNotice:["skickade ett meddelande","sent a message"],
  invalid:["Kontrollera uppgifterna.","Check your entries."], network:["Servern kan inte nås.","The server is unreachable."],
  past:["Välj en tid i framtiden.","Choose a future date and time."], full:["Det finns inte tillräckligt med platser.","There aren’t enough spaces."],
  password:["Minst 8 tecken och minst ett specialtecken, till exempel ! eller #.","At least 8 characters and one special character, such as ! or #."],
  adult:["Bekräfta att du är minst 18 år.","Confirm that you are at least 18."], closed:["Registreringen är stängd.","Registration is closed."],
  emailUsed:["E-postadressen används redan.","That email address is already in use."],
  forbidden:["Du saknar behörighet.","You don’t have permission."], loginRequired:["Logga in för att fortsätta.","Sign in to continue."],
  badLogin:["Inloggningen misslyckades.","Sign-in failed."], missing:["Detta är inte längre tillgängligt.","This is no longer available."],
  server:["Serverfel. Försök igen.","Server error. Try again."],
  configured:["Firebase är anslutet.","Firebase is connected."],
  key:["Firebase Web API key","Firebase Web API key"],
  setup:["Anslut ditt Firebase-projekt för att använda appen.","Connect your Firebase project to use the app."],
  invalidConnection:["Kontrollera API-adressen och Firebase-nyckeln.","Check the API URL and Firebase key."],
  schemaMissing:["Kontrollera Firebase- och API-konfigurationen.","Check the Firebase and API configuration."],
  confirmEmail:["Öppna verifieringslänken i din e-post och logga sedan in igen.","Open the verification link in your email, then sign in again."],
  code:["Kod från din e-post","Code from your email"], verify:["Bekräfta konto","Verify account"],
  forgotPassword:["Glömt lösenord?","Forgot password?"],
  resetPassword:["Återställ lösenord","Reset password"],
  resetHelp:["Ange e-postadressen som du använder för Hänga Gbg.","Enter the email address you use for Hänga Gbg."],
  resetSend:["Skicka återställningslänk","Send reset link"],
  resetSent:["Om det finns ett konto för adressen får du en återställningslänk. Kontrollera även skräpposten. Logga in här när du har valt ett nytt lösenord.","If an account exists for that address, you’ll receive a reset link. Check your spam folder too. Sign in here after choosing a new password."],
  resend:["Skicka ny länk","Resend link"], codeSent:["Kontrollera din e-post.","Check your email."],
  badCode:["Koden är ogiltig eller har löpt ut.","The code is invalid or expired."],
  blocked:["Kontot är blockerat.","This account is blocked."],
  mailRate:["För många försök. Vänta en stund och försök igen.","Too many attempts. Wait a moment and try again."],
  smtpRequired:["Serverns e-posttjänst är inte konfigurerad för din adress.","The server email service is not configured for your address."],
  samePassword:["Välj ett annat lösenord.","Choose a different password."],
  reauth:["Bekräfta ditt lösenord igen.","Confirm your password again."],
  emailPending:["Bekräfta ändringen via e-post.","Confirm the change by email."],
  messageDemo:["Demomeddelanden stannar på den här enheten.","Demo messages stay on this device."],
  fika:["Fika","Coffee"], food:["Mat & dryck","Food & drink"], music:["Musik","Music"], games:["Spel","Games"],
  sport:["Sport","Sports"], nature:["Natur","Outdoors"], culture:["Kultur","Culture"], nightlife:["Nattliv","Nightlife"],
  chill:["Lugn","Chill"], social:["Social","Social"], active:["Aktiv","Active"]
};
const areas = [
  "Centrum","Lorensberg","Vasastaden","Johanneberg","Haga","Linné","Järntorget","Masthugget","Majorna","Kungsladugård",
  "Sandarna","Högsbo","Frölunda","Tynnered","Askim","Hovås","Billdal","Näset","Fiskebäck","Älvsborg","Saltholmen",
  "Guldheden","Krokslätt","Örgryte","Bö","Lunden","Olskroken","Redbergsplatsen","Gårda","Stampen","Bagaregården",
  "Kålltorp","Härlanda","Björkekärr","Torpa","Gamlestaden","Kviberg","Utby","Kortedala","Bergsjön","Angered",
  "Hammarkullen","Hjällbo","Gårdsten","Lövgärdet","Rannebergen","Agnesberg","Gunnilse","Olofstorp",
  "Hisingen","Brunnsbo","Backa","Hisings Backa","Bäckebol","Skälltorp","Kvillebäcken","Kvilledalen","Lundby",
  "Ramberget","Brämaregården","Ringön","Frihamnen","Lindholmen","Eriksberg","Sannegården","Färjenäs","Kyrkbyn",
  "Biskopsgården","Länsmansgården","Svartedalen","Jättesten","Tuve","Säve","Kärra","Torslanda","Amhult",
  "Arendal","Björlanda","Hjuvik","Öckerö","Styrsö","Donsö","Vrångö","Brännö",
  "Mölndal","Kållered","Lindome","Partille","Sävedalen","Jonsered","Landvetter","Mölnlycke","Härryda",
  "Lerum","Floda","Kungälv","Ytterby","Surte","Bohus","Nödinge","Kungsbacka","Särö","Alingsås"
];
const cats = ["fika","food","music","games","sport","walk","nature","culture","nightlife","other"];
const starterMeetups = [
  {title:["Fika vid Vågmästareplatsen","Coffee at Vågmästareplatsen"],area:"Kvillebäcken",place:"Vågmästareplatsen",category:"fika",capacity:5},
  {title:["Promenad på Ramberget","Walk on Ramberget"],area:"Ramberget",place:"Keillers park",category:"walk",capacity:8},
  {title:["Brädspel i centrum","Board games in the centre"],area:"Centrum",place:"",category:"games",capacity:6}
];
const moods = ["","chill","social","active"];
const zone = "Europe/Stockholm";
let lang = localStorage.lang === "en" ? "en" : "sv";
const demo = window.HANGA_DEMO === true;
let base = demo ? "" : (hangaCloud.configuration.url && hangaCloud.configuration.key ? hangaCloud.configuration.url : "");
let token = demo ? localStorage.hangaDemoToken || "" : hangaCloud.signedIn ? "firebase" : "";
let pendingEmail = "";
let blockedPeople=[];
let user = null, events = [], messageList = [], noticeList = [], admin = null;
let cityItems = [], cityRequest, cityLoadedAt = 0, cityUnavailable = false;
const cityId = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const cityPortal = "https://goteborg.se/wps/portal/kalendarium/kalendarium-start?activityId=";
function validCityEvent(item) {
  return item && cityId.test(item.id) && item.source===cityPortal+item.id
    && [item.title,item.place,item.organizer].every(value=>typeof value==="string")
    && Number.isFinite(Date.parse(item.start)) && Date.parse(item.end)>=Date.parse(item.start);
}

function loadCityCalendar() {
  if (demo || !base || Date.now()-cityLoadedAt<(cityUnavailable?60000:600000)) return;
  if (cityRequest) return cityRequest;
  const origin=base;
  cityRequest=(async()=>{
    try {
      const response=await fetch(origin+"/city-events",{redirect:"error",credentials:"omit",signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error("cityCalendarUnavailable");
      const items=await response.json();
      if (!Array.isArray(items)) throw new Error("cityCalendarUnavailable");
      if (origin===base) {
        cityItems=items.filter(validCityEvent).map(item=>({...item,city:true,area:"Göteborg",category:"other"}));
        cityLoadedAt=Date.now();
        cityUnavailable=false;
      }
    } catch {
      if (origin===base) {
        cityUnavailable=true;
        cityLoadedAt=Date.now();
      }
    }
  })().finally(()=>{cityRequest=undefined;});
  return cityRequest;
}
const findCity = id => cityItems.find(event=>event.id===id && !isPast(event));

const defaultFilters = { query:"", area:"", category:"", period:"upcoming", eventSource:"" };
let filters = {...defaultFilters};
let renderedResults;
const PAGE_SIZE = 5;
const browseOrder = new Map();
let eventPageIndex = 0;
let refreshId = 0, statusTimeout;
const t = key => copy[key]?.[lang === "en" ? 1 : 0] || key;
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const $ = id => document.getElementById(id);
const action = (text, extra="", klass="") => `<button type="button" class="${klass}" ${extra}>${esc(text)}</button>`;
const link = (key, url, klass="") => `<a class="action ${klass}" href="${esc(url)}">${esc(t(key))}</a>`;
const field = (key, name, value="", type="text", attrs="") => `<label>${t(key)}<input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
function passwordField(label,name,{policy=false,required=false,autocomplete="current-password"}={}) {
  const hint=policy?`<small class="muted">${t("password")}</small>`:"";
  return `<label>${t(label)}${hint}<span class="password-field">
    <input name="${name}" type="password" autocomplete="${autocomplete}" ${required?"required":""} ${policy?'minlength="8" maxlength="72"':""}>
    <button type="button" data-password-toggle aria-pressed="false" aria-label="${t("passwordShow")}">👁</button>
  </span></label>`;
}
const passwordSymbols = "^$*.[]{}()?!@#%&/\\,><':;|_~" + '"';
const passwordValid = value => value.length>=8 && [...value].some(char=>passwordSymbols.includes(char));
const textArea = (key,name,value,attrs="") => `<label>${t(key)}<textarea name="${name}" ${attrs}>${esc(value)}</textarea></label>`;
const option = (value,label,current) => `<option value="${esc(value)}" ${value===current?"selected":""}>${esc(label)}</option>`;
const select = (label,name,choices,current) => `<label>${t(label)}<select name="${name}">${choices.map(([v,l])=>option(v,l,current)).join("")}</select></label>`;
const route = () => (location.hash.slice(1) || "discover").split("/");
const calendar = new Intl.DateTimeFormat("sv-SE",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
const localDate = date => calendar.format(date).replace(" ","T");
function stockholmDate(value) {
  const wanted = Date.parse(value+"Z");
  let epoch = wanted;
  for (let i=0; i<3; i++) epoch += wanted - Date.parse(localDate(new Date(epoch))+"Z");
  const result = new Date(epoch);
  if (localDate(result)!==value) throw new Error("invalid");
  return result.toISOString();
}
function dateLabel(value) {
  return new Date(value).toLocaleString(lang==="en" ? "en-GB" : "sv-SE",{timeZone:zone,dateStyle:"medium",timeStyle:"short"});
}
function status(key) {
  const el = $("status");
  clearTimeout(statusTimeout);
  el.textContent = t(copy[key] ? key : "invalid");
  el.hidden = false;
  statusTimeout = setTimeout(()=>{el.hidden=true},3800);
}
async function api(path, body) {
  if (demo) return demoApi(path,body);
  if (!base) throw new Error("setup");
  return hangaCloud.request(path,body);
}
const DEFAULT_REMINDER_MINUTES = 120;
function reminderScope() { return user ? (demo?"demo":base)+":"+user.id : ""; }
function reminderKey(id) { return "hangaReminder:"+reminderScope()+":"+id; }
function reminderMinutes(id) {
  const saved=localStorage.getItem(reminderKey(id));
  return saved===null?DEFAULT_REMINDER_MINUTES:Number(saved);
}
function eligibleReminder(event) {
  return user && event.joined && !event.hidden && !event.cancelled && Date.parse(event.start)>Date.now();
}
function syncReminders(items=events) {
  if (!window.HangaAndroid) return;
  const scope=reminderScope();
  const entries=scope?items.filter(eligibleReminder).flatMap(event=>{
    const minutes=reminderMinutes(event.id);
    const start=Date.parse(event.start);
    return minutes>0?[{id:Number(event.id),title:eventTitle(event),start,at:start-minutes*60000}]:[];
  }):[];
  window.HangaAndroid.syncReminders(JSON.stringify(entries),scope,lang);
}
window.hangaRefreshReminders=async ()=>{
  const scope=reminderScope();
  const version=refreshId;
  if (!scope) return;
  try {
    const current=await api("/events");
    if (scope===reminderScope() && version===refreshId) syncReminders(current);
  } catch(error) {
    if (scope===reminderScope() && ["loginRequired","blocked"].includes(error.message)) session();
  }
};
function syncAlertProfile() {
  if (!demo && user) window.HangaAndroid?.syncAlertProfile?.(
    localStorage.hangaAlertToken||"",String(user.id),user.area||"",lang);
}
function session(result) {
  token=result?.token || "";
  user=result?.user || null;
  if (demo) {
    if (token) localStorage.hangaDemoToken=token;
    else localStorage.removeItem("hangaDemoToken");
  } else if (!token) hangaCloud.forget();
  if (!user) syncReminders([]);
  else syncAlertProfile();
}
async function disableAlerts() {
  if (demo || !window.HangaAndroid) return;
  window.HangaAndroid.stopAlerts();
  const pushToken=localStorage.hangaAlertToken;
  localStorage.removeItem("hangaAlertToken");
  if (pushToken && base && user) {
    try { await api("/alerts/off",{token:pushToken}); } catch {}
  }
}
window.hangaAlertDenied=()=>status("alertsDenied");
window.hangaAlertFailed=()=>{ disableAlerts(); status("alertsFailed"); };
function seed() {
  const data = JSON.parse(localStorage.demoData || "null");
  const extra = [
    ["Kvällspromenad i Slottsskogen","Evening walk in Slottsskogen","Linné","Slottsskogen","nature"],
    ["Fika vid Vågmästareplatsen","Coffee at Vågmästareplatsen","Kvillebäcken","Vågmästareplatsen","fika"],
    ["Fotopromenad i Eriksberg","Photo walk in Eriksberg","Eriksberg","Eriksbergstorget","culture"],
    ["Söndagspromenad vid Delsjön","Sunday walk by Delsjön","Kålltorp","Delsjöbadet","nature"],
    ["Brädspel i centrum","Board games in the centre","Centrum","Götaplatsen","games"]
  ];
  if (data && data.sampleEdition===2) return data;
  const samples = [
    ["Fika i Haga","Coffee in Haga","Haga","Haga Nygata","fika",0],["Promenad på Ramberget","Walk on Ramberget","Hisingen","Keillers park","nature",0],
    ["Brädspel vid Järntorget","Board games by Järntorget","Järntorget","Järntorget 4","games",60]
  ];
  const seeded = data || { next:4, events:samples.map(([sv,en,area,place,category,price],i)=>({
    id:i+1,owner:2,title:sv,titleEn:en,description:"",area,place,category,price,start:new Date(Date.now()+(i+1)*86400000).toISOString(),
    capacity:i===2?2:8,count:i,newcomers:i!==2,quick:i===1,joined:0,saved:0,hidden:0,mood:"social",source:"",organizer:"Hänga Gbg"
  })), user:{id:1,name:"Demo",email:"demo@example.invalid",admin:1} };
  for (const [i,[title,titleEn,area,place,category]] of extra.entries()) {
    seeded.events.push({id:seeded.next++,owner:2,title,titleEn,area,place,category,price:0,
      start:new Date(Date.now()+(4+i)*86400000).toISOString(),capacity:6,count:0,
      organizer:"Hänga Gbg",newcomers:true});
  }
  seeded.sampleEdition=2;
  return seeded;
}
function demoApi(path, body) {
  const data=seed();
  let result={};
  const match=path.match(/^\/events\/(\d+)\/(\w+)$/);
  const event=match&&data.events.find(row=>row.id===Number(match[1]));
  if (path==="/events" && !body) result=data.events;
  else if (path==="/demo") result={token:"demo", user:data.user};
  else if (!token) throw new Error("loginRequired");
  else if (path==="/me") {
    if (body) {
      const {name,email,area,bio,interests,languages}=body;
      Object.assign(data.user,{name,email,area,bio,interests,languages});
    }
    result=data.user;
  } else if (path==="/account/delete") {
    localStorage.removeItem("demoData");
    return {};
  } else if (path==="/events") {
    data.events.push({...body,id:data.next++,owner:1,organizer:data.user.name,count:0,joined:0,saved:0});
  } else if (path==="/messages") result=(data.messages||[]).filter(m=>!(data.blocks||[]).includes(m.recipient)).slice().reverse();
  else if (path==="/notices") result=(data.notices||[]).slice().reverse();
  else if (path==="/blocks") result=(data.blocks||[]).map(id=>({id,name:"Hänga Gbg"}));
  else if (path==="/blocks/change") {
    data.blocks=(data.blocks||[]).filter(id=>id!==body.id);
    if (body.enabled) data.blocks.push(body.id);
  } else if (path==="/report") {
    const event=data.events.find(e=>e.id===body.id);
    const message=(data.messages||[]).find(m=>m.id===body.message);
    (data.reports ||= []).push({id:data.next++,context:event?.title||message?.body||"Hänga Gbg",reason:body.reason,event_id:body.id});
  } else if (path==="/reports/resolve") {
    const report=(data.reports||[]).find(r=>r.id===body.id);
    if (report) report.resolved=true;
  }
  else if (path==="/admin") result={users:[data.user],registration:data.registration??1,reports:data.reports||[]};
  else if (path==="/admin/settings") data.registration=Number(body.registration);
  else if (event) {
    const operation=match[2];
    const notice=kind=>(data.notices ||= []).push({title:event.title,event_id:event.id,kind,name:"",created:new Date().toISOString()});
    if (operation==="edit") {
      if (event.joined && (event.start!==body.start || event.place!==body.place || event.area!==body.area)) notice("changed");
      Object.assign(event,body);
      delete event.titleEn;
    }
    if (operation==="cancel") { event.cancelled=true; notice("cancelled"); }
    if (operation==="waitlist") event.waitlisted=body.enabled;
    if (operation==="simulate") {
      if (event.waitlisted && event.count>=event.capacity && event.capacity>0) {
        event.count--;
        notice("vacancy");
      }
    }
    if (operation==="delete") data.events=data.events.filter(row=>row.id!==event.id);
    if (operation==="moderate") event.hidden=Number(body.hidden);
    if (operation==="join") {
      if (body.enabled&&event.cancelled) throw new Error("cancelled");
      if (body.enabled&&!event.joined&&event.count>=event.capacity) throw new Error("full");
      event.count+=Number(body.enabled)-Number(Boolean(event.joined));
      event.joined=Number(body.enabled);
      if (body.enabled) event.waitlisted=false;
    }
    if (operation==="save") event.saved=Number(body.enabled);
    if (operation==="participants") result=event.owner===1?[]:[{id:event.owner,name:event.organizer}];
    if (operation==="message") {
      if (!body.body?.trim()) throw new Error("invalid");
      if ((data.blocks||[]).includes(body.recipient)) throw new Error("messageBlocked");
      (data.messages ||= []).push({id:data.next++,event_id:event.id,title:event.title,sender:1,recipient:body.recipient,
        sender_name:data.user.name,recipient_name:event.organizer,body:body.body.trim(),created:new Date().toISOString()});
    }
  } else if (path!=="/logout") throw new Error("missing");
  localStorage.demoData=JSON.stringify(data);
  return result;
}
async function load() {
  const version=++refreshId;
  const [page,detail]=route();
  const cityLoad=page==="discover"||page==="city"||(page==="create"&&detail==="city")?loadCityCalendar():undefined;
  try {
    if (token && !user) {
      try {
        user=await api("/me");
        syncAlertProfile();
        if (version===refreshId && page==="discover") render();
      }
      catch(error) { if (["loginRequired","blocked"].includes(error.message)) {
        session();
        if (error.message==="blocked") status("blocked");
      } else throw error; }
    }
    if ((demo || base) && ["discover","plans","event","create","admin","city"].includes(page)) {
      const current=await api("/events");
      if (version!==refreshId) return;
      events=current;
      syncReminders();
      if (page==="discover" && $("results")) {
        refreshResults();
        await cityLoad;
        if (version===refreshId && $("results")) refreshResults();
        return;
      }
    }
    await cityLoad;
    if (version!==refreshId) return;
    if (page==="messages" && user) messageList=await api("/messages");
    if (page==="profile" && user) blockedPeople=await api("/blocks");
    if (page==="notices" && user) noticeList=(await api("/notices")).filter(notice=>notice.kind!=="reminder");
    if (page==="admin" && user?.admin) admin=await api("/admin");
  } catch(error) {
    if (["loginRequired","blocked"].includes(error.message)) session();
    status(error.message);
  }
  if (version===refreshId) render();
}
function areaSelect(value="") {
  const custom=Boolean(value && !areas.includes(value));
  return select("area","area",[["",t("anyArea")],...areas.map(area=>[area,area]),["other",t("other")]],custom?"other":value)+
    `<div id="customArea" ${custom?"":"hidden"}>${field("customArea","customArea",custom?value:"","text",'maxlength="100"')}</div>`;
}
function hasArea(event,area) {
  if (!area) return true;
  if (area==="other") return !areas.includes(event.area);
  return event.area===area;
}
function render() {
  const [page,id,recipient]=route();
  document.documentElement.lang=lang;
  const pages=["discover","plans","create","messages","profile","settings"];
  if (user?.admin) pages.push("admin");
  const menuLinks=pages.map(key=>`<a class="action" href="#${key}" ${page===key?'aria-current="page"':""}>${t(key==="settings"?"preferences":key)}</a>`).join("");
  $("header-actions").innerHTML=`<details class="account-menu settings-menu">
    <summary aria-label="${t("accountMenu")}" title="${t("accountMenu")}"><span aria-hidden="true">⚙</span></summary>
    <nav class="account-menu-panel" aria-label="${t("accountMenu")}">${menuLinks}</nav>
  </details>`;
  let html;
  if (page==="settings") html=settingsPage();
  else if (page==="discover") html=discoverPage();
  else if (page==="auth") html=authPage(id);
  else if (page==="city") html=cityPage(findCity(id));
  else if (page==="event") html=eventPage(events.find(item=>item.id===Number(id)),recipient);
  else if (!user) html=`<h1>${t(page)}</h1><p>${t("loginRequired")}</p>${link("login","#auth","primary")}`;
  else if (page==="create") {
    const draft=user.admin&&id==="draft"?starterMeetups[Number(recipient)]:null;
    const repeat=id==="repeat"?events.find(item=>item.id===Number(recipient)&&item.owner===user.id&&isPast(item)):null;
    html=id==="repeat"&&!repeat?`<h1>${t("missing")}</h1>`:
      id==="city"?(findCity(recipient)?eventForm(null,null,null,findCity(recipient)):`<h1>${t("missing")}</h1>`):
      id==="quick"?quickForm():eventForm(events.find(item=>item.id===Number(id)),draft,repeat);
  }
  else if (page==="report") html=reportPage(id,recipient);
  else if (page==="plans") html=plansPage();
  else if (page==="profile") html=profilePage();
  else if (page==="admin") html=user.admin && admin ? adminPage() : `<h1>${t("admin")}</h1><p>${t("forbidden")}</p>`;
  else if (page==="messages") html=messagesPage();
  else if (page==="notices") html=noticesPage();
  else html=discoverPage();
  $("main").innerHTML=html;
}
function settingsPage() {
  return `<h1>${t("preferences")}</h1><div class="card">
    ${select("interfaceLanguage","appLanguage",[["sv","Svenska"],["en","English"]],lang)}
    <div class="actions">${!demo&&window.HangaAndroid?.checkForUpdate?action(t("checkUpdates"),"data-check-updates"):""}${link("contact","mailto:t.davor@gmail.com")}</div></div>
    ${!demo&&!base?`<p>${t("connectionHelp")}</p><form data-form="settings">
    ${field("url","url",base,"url",'required placeholder="https://hanga-gbg.ditt-konto.workers.dev"')}
    ${field("key","key",hangaCloud.configuration.key,"text",'required autocomplete="off" spellcheck="false"')}
    <button class="primary" type="submit">${t("connect")}</button></form>`:""}`;
}
function authPage(mode) {
  const register=mode==="register";
  if (user) return `<h1>${t("profile")}</h1>${link("profile","#profile","primary")}`;
  if (demo) return `<h1>${t("login")}</h1><p>${t("demoBanner")}</p>${action(t("demo"),"data-demo","primary")}`;
  if (!base) return `<h1>${t("login")}</h1><p>${t("setup")}</p>${link("connect","#settings","primary")}`;
  if (mode==="reset") return `<h1>${t("resetPassword")}</h1><p>${t("resetHelp")}</p>
    <form data-form="reset">
      ${field("email","email",pendingEmail,"email",'required autocomplete="email"')}
      <button class="primary" type="submit">${t("resetSend")}</button>
    </form><div class="actions">${link("login","#auth")}</div>`;
  if (mode==="reset-sent") return `<h1>${t("resetPassword")}</h1><p>${t("resetSent")}</p>
    <div class="actions">${link("login","#auth","primary")}</div>`;
  if (mode==="confirm") return `<h1>${t("verify")}</h1><p>${t("confirmEmail")}</p>
    <div class="actions">${action(t("resend"),"data-resend")} ${link("login","#auth","primary")}</div>`;
  return `<h1>${t(register?"register":"login")}</h1><form data-form="${register?"register":"login"}">
    ${register?field("name","name","","text",'required maxlength="80"')+areaSelect():""}
    ${field("email","email",pendingEmail,"email",'required autocomplete="email"')}
    ${passwordField("passwordLabel","password",{policy:register,required:true,autocomplete:register?"new-password":"current-password"})}
    ${register?`<label class="check"><input name="adult" type="checkbox" required> ${t("adultLabel")}</label>`:""}
    <button class="primary">${t(register?"register":"login")}</button></form>
    <div class="actions">${register?"":action(t("forgotPassword"),"data-forgot-password")} ${link(register?"login":"register",register?"#auth":"#auth/register")}
    </div>`;
}
function discoverPage() {
  return `<section class="hero"><h1>${t("browse")}</h1><p>${t("intro")}</p><div class="actions">${link("quick","#create/quick","primary")}${link("create","#create")} ${action(t("browseEvents"),"data-browse-events")}</div></section>
    ${demo?`<p class="muted">${t("demoBanner")}</p>`:!base?`<p>${t("setup")}</p>${link("connect","#settings")}`:""}
    <a class="action" href="https://buymeacoffee.com/wjkrddbhyx">☕ Buy me a coffee</a>
    <details class="discover-filters" ${hasFilters()?"open":""}><summary>${t("searchFilters")}</summary>
    <form id="filter" class="grid">
      <div class="wide">${field("keyword","query",filters.query,"search",`placeholder="${t("search")}"`)}</div>
      ${select("area","area",[["",t("anyArea")],...areas.map(x=>[x,x]),["other",t("other")]],filters.area)}
      ${select("category","category",[["",t("all")],...cats.map(x=>[x,t(x)])],filters.category)}
      ${demo?"":select("eventSource","eventSource",[["",t("all")],["community",t("communityEvents")],["city",t("cityCalendar")]],filters.eventSource)}
      ${select("events","period",["upcoming","today","tonight"].map(x=>[x,t(x)]),filters.period)}
      <label class="check wide"><input type="checkbox" name="newcomers" ${filters.newcomers?"checked":""}> ${t("newcomers")}</label>
    </form></details>
    <h2 id="browse-heading" tabindex="-1">${t("browseEvents")}</h2>
    <section id="results" aria-live="polite">${renderedResults=results()}</section>`;
}
function refreshResults() {
  const markup=results();
  if (markup===renderedResults) return;
  $("results").innerHTML=markup;
  renderedResults=markup;
}
function focusEventList() {
  const heading=$("browse-heading");
  heading.focus({preventScroll:true});
  heading.scrollIntoView({block:"start"});
}
function hasFilters() {
  return Boolean(filters.query.trim() || filters.area || filters.category ||
    filters.period!=="upcoming" || filters.newcomers || filters.eventSource);
}
function results() {
  const term=filters.query.trim().toLowerCase();
  const today=localDate(new Date()).slice(0,10);
  const matching=[...events,...cityItems].filter(event=>{
    if (filters.eventSource && filters.eventSource!==(event.city?"city":"community")) return false;
    const date=localDate(new Date(event.start));
    if (event.hidden || event.cancelled || (filters.newcomers && !event.newcomers) || isPast(event) || !hasArea(event,filters.area)) return false;
    if (filters.category && event.category!==filters.category) return false;
    if (filters.period!=="upcoming" && !date.startsWith(today)
        && !(event.city && date<today && localDate(new Date(event.end)).slice(0,10)>=today)) return false;
    if (filters.period==="tonight" && date.slice(11,13)<"17") return false;
    const words=[event.title,event.titleEn,event.description,event.area,event.place,t(event.category),
      copy[event.category]?.[0],copy[event.category]?.[1]].filter(Boolean).join(" ").toLowerCase();
    return !term || term.split(/\s+/).every(word=>words.includes(word));
  });
  if (!matching.length) {
    eventPageIndex=0;
    return `<p class="muted">${t(cityUnavailable&&filters.eventSource==="city"?"cityCalendarUnavailable":"none")}</p>`;
  }
  if (!hasFilters()) {
    for (const event of matching.filter(event=>!event.city)) {
      if (!browseOrder.has(event.id)) browseOrder.set(event.id,Math.random());
    }
    const community=matching.filter(event=>!event.city).sort((a,b)=>browseOrder.get(a.id)-browseOrder.get(b.id));
    const municipal=matching.filter(event=>event.city);
    matching.length=0;
    while (community.length && municipal.length) matching.push(...community.splice(0,2),municipal.shift());
    matching.push(...community,...municipal);
  }
  const pageCount=Math.ceil(matching.length/PAGE_SIZE);
  eventPageIndex=Math.max(0,Math.min(eventPageIndex,pageCount-1));
  const start=eventPageIndex*PAGE_SIZE;
  const page=matching.slice(start,start+PAGE_SIZE).map(event=>event.city?cityCard(event):card(event)).join("");
  if (pageCount===1) return page;
  return page+`<div class="event-pages">
    ${action(t("previous"),`data-event-page="-1" ${eventPageIndex===0?"disabled":""}`)}
    <span>${t("page")} ${eventPageIndex+1} / ${pageCount}</span>
    ${action(t("next"),`data-event-page="1" ${eventPageIndex===pageCount-1?"disabled":""}`)}
  </div>`;
}
function isPast(event) { return Date.parse(event.city?event.end:event.start)<=Date.now(); }
function eventTitle(e) { return lang==="en" && e.titleEn ? e.titleEn : e.title; }
function price(e) { return e.price ? esc(e.price)+" kr" : t("free"); }
function googleMapsUrl(event) {
  const query=[event.place,event.area,"Sverige"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function eventAddress(event) {
  const address=[event.place,event.area].filter(Boolean).join(", ");
  return `<a href="${esc(googleMapsUrl(event))}">${esc(address)}</a>`;
}
function cityActions(event) {
  return `<div class="actions">${action(t("cityShare"),`data-share-city="${esc(event.id)}"`)}
    ${link("arrangeCityMeetup",user?`#create/city/${esc(event.id)}`:`#auth/login/${esc(event.id)}`,"primary")}</div>`;
}
function cityCard(event) {
  return `<article class="card city-card"><span class="pill">${t("cityCalendar")}</span>
    <h2><a href="#city/${esc(event.id)}">${esc(event.title)}</a></h2>
    <p class="muted">${esc(dateLabel(event.start))}${event.place?" · "+esc(event.place):""}</p></article>`;
}
function cityPage(event) {
  if (!event) return `<h1>${t("cityCalendar")}</h1><p>${t(cityUnavailable?"cityCalendarUnavailable":"missing")}</p>`;
  const meetups=events.filter(e=>e.source===event.source&&!e.hidden&&!e.cancelled&&!isPast(e));
  return `<span class="pill">${t("cityCalendar")}</span><h1>${esc(event.title)}</h1>
    <p>${esc(dateLabel(event.start))}${event.end!==event.start?" – "+esc(dateLabel(event.end)):""}</p>
    ${event.place?`<p>${eventAddress(event)}</p>`:""}${event.organizer?`<p>${esc(event.organizer)}</p>`:""}
    <div class="actions">${link("source",event.source)}</div>${cityActions(event)}
    ${meetups.length?`<h2>${t("cityMeetups")}</h2>${meetups.map(e=>card(e)).join("")}`:""}`;
}
function card(e,controls="") {
  return `<article class="card"><div class="rows between"><span class="pill">${esc(t(e.category))}</span><span class="pill">${price(e)}</span></div>
    ${eventBadges(e)}<h2><a href="#event/${Number(e.id)}">${esc(eventTitle(e))}</a></h2>
    <p class="muted">${esc(dateLabel(e.start))} · ${eventAddress(e)}</p>
    <p>${Number(e.count)}/${Number(e.capacity)} ${t("attendees").toLowerCase()}${e.hidden?" · "+t("hidden"):""}</p>${controls}</article>`;
}
function eventBadges(e) {
  return `<div class="rows">${["quick","newcomers","cancelled"].filter(key=>e[key]).map(key=>
    `<span class="pill">${t(key==="quick"?"quickBadge":key)}</span>`).join("")}</div>`;
}
function safetyActions(person, type, id) {
  if (!user || Number(person)===user.id) return "";
  return `<div class="actions">${link({event:"reportEvent",person:"reportPerson",message:"reportMessage"}[type],`#report/${type}/${Number(id)}`)}
    ${type==="person"?"":link("reportPerson",`#report/person/${Number(person)}`)}
    ${action(t("blockPerson"),`data-block-person="${Number(person)}" data-value="true"`)}</div>`;
}
function reportPage(type,id) {
  if (!["event","person","message"].includes(type)||!Number(id)) return `<h1>${t("missing")}</h1>`;
  return `<h1>${t("report")}</h1><form data-form="report" data-type="${type}" data-id="${Number(id)}">
    ${textArea("reportReason","reason","","required maxlength=500")}<button class="primary">${t("report")}</button></form>`;
}
function quickForm() {
  return `<h1>${t("quick")}</h1><form data-form="event">
    <input type="hidden" name="quick" value="on">
    ${field("title","title","","text",'required maxlength="120"')}
    ${select("category","category",cats.map(key=>[key,t(key)]))}
    ${areaSelect(user.area)}${field("place","place","","text",'required maxlength="180"')}
    ${field("date","start",localDate(new Date(Date.now()+3600000)),"datetime-local",'required')}
    <label class="check"><input type="checkbox" name="newcomers" checked> ${t("newcomers")}</label>
    <button class="primary">${t("publish")}</button></form>`;
}
function reminderForm(event) {
  if (!eligibleReminder(event)) return "";
  const minutes=reminderMinutes(event.id);
  return `<form data-form="reminder" data-id="${Number(event.id)}"><h2>${t("reminderTitle")}</h2>
    <p class="muted">${t("reminderNote")}</p>
    ${field("reminderMinutes","minutes",minutes||DEFAULT_REMINDER_MINUTES,"number",'required min="1" max="10080" step="1"')}
    <label class="check"><input type="checkbox" name="off" ${minutes===0?"checked":""}> ${t("reminderOff")}</label>
    <div class="actions"><button class="primary" type="submit">${t("save")}</button>
      ${window.HangaAndroid?action(t("allowReminder"),"data-allow-reminder"):""}
      ${window.HangaAndroid?.preciseReminderAccessNeeded()?action(t("preciseReminder"),"data-precise-reminder"):""}
    </div></form>`;
}
function eventPage(e, recipient) {
  if (!e) return `<h1>${t("missing")}</h1>`;
  const manager = user&&(e.owner===user.id||user.admin);
  const target=Number(recipient)||e.owner;
  const form=user&&(e.joined||e.owner===user.id)&&user.id!==target&&!e.cancelled?`<form data-form="message" data-id="${Number(e.id)}" data-recipient="${Number(target)}">
    ${textArea("message","body","","required maxlength=1500")}<button class="primary">${t("send")}</button></form>`:"";
  const endpoint=googleMapsUrl(e);
  const command=(name,op,enabled,klass="")=>action(t(name),`data-event="${Number(e.id)}" data-op="${op}" data-value="${enabled}"`,klass);
  const open=!e.cancelled && !e.hidden && new Date(e.start)>new Date();
  const joinButton=e.joined?command("leave","join",false):
    !open?"":e.count<e.capacity?command("join","join",true,"primary"):
    !e.waitlisted?command("waitlist","waitlist",true,"primary"):"";
  const waitingButton=e.waitlisted?command("leaveWaitlist","waitlist",false):"";
  return `<h1>${esc(eventTitle(e))}</h1>${eventBadges(e)}<p class="pill">${esc(t(e.category))} · ${price(e)}${e.mood?" · "+esc(t(e.mood)):""}</p>
    <p>${esc(dateLabel(e.start))} · ${eventAddress(e)}</p><p>${t("organizer")} · ${esc(e.organizer)}</p>
    <p>${Number(e.count)}/${Number(e.capacity)} ${t("attendees").toLowerCase()}</p><p>${esc(e.description)}</p>
    <div class="actions">${link("map",endpoint)}${typeof e.source==="string"&&e.source.startsWith("https://")?link("source",e.source):""}
    ${!e.cancelled?action(t("share"),`data-share="${Number(e.id)}"`):""}
    ${user?`${joinButton}${waitingButton}${demo&&e.waitlisted&&e.count>=e.capacity?command("simulateVacancy","simulate",true):""}${command(e.saved?"removePlan":"savePlan","save",!e.saved)}`:open?link("login","#auth","primary"):""}</div>
    ${reminderForm(e)}
    ${manager?`<div class="card"><div class="actions">${e.cancelled?"":link("edit","#create/"+e.id)}${open?command("cancelEvent","cancel",true,"danger"):""}${command("deleteEvent","delete",true,"danger")}
       ${user.admin?command(e.hidden?"show":"hide","moderate",!e.hidden):""}</div></div>`:""}${user&&(manager||e.joined)?`<div class="card">${command("attendees","participants",true)}<div id="participants"></div></div>`:""}${form}${safetyActions(target,recipient?"person":"event",recipient?target:e.id)}`;
}
function eventForm(e,draft,repeat,city) {
  const values=e||repeat|| (city&&{title:city.title,place:city.place,source:city.source,category:"other"});
  const cityStart=city?new Date(Math.max(Date.parse(city.start),Date.now()+60000)):null;
  if (e && e.owner!==user.id && !user.admin) return `<h1>${t("forbidden")}</h1>`;
  return `<h1>${t(city?"arrangeCityMeetup":repeat?"repeat":e?"edit":"create")}</h1>${draft?`<p>${t("templateDate")}</p>`:""}${city?`<p>${t("cityMeetupHelp")}</p>`:""}<form data-form="event" data-id="${e?.id ? Number(e.id) : ""}">
    ${field("title","title",values?.title||draft?.title[lang==="en"?1:0],"text",'required maxlength="120"')}
    ${textArea("description","description",values?.description,'maxlength="3000"')}
    <div class="grid">${select("category","category",cats.map(x=>[x,t(x)]),values?.category||draft?.category)}
    ${select("mood","mood",moods.map(x=>[x,x?t(x):"—"]),values?.mood)}</div>
    ${areaSelect(values?.area||draft?.area||user.area)}${field("place","place",values?.place||draft?.place,"text",'required maxlength="180"')}
    ${field("date","start",draft||repeat?"":localDate(cityStart||(e?new Date(e.start):new Date(Date.now()+86400000))),"datetime-local",'required')}
    <div class="grid">${field("price","price",values?.price??0,"number",'required min="0" max="100000"')}
    ${field("capacity","capacity",values?.capacity??draft?.capacity??6,"number",'required min="1" max="5000"')}</div>
    ${e?.quick?'<input type="hidden" name="quick" value="on">':""}
    <label class="check"><input type="checkbox" name="newcomers" ${(values?.newcomers||draft)?"checked":""}> ${t("newcomers")}</label>
    ${field("source","source",values?.source,"url",'maxlength="750" placeholder="https://"')}
    <button class="primary">${t(e?"save":"publish")}</button>
    </form>`;
}
function plansPage() {
  const owned=events.filter(event=>event.owner===user.id);
  const active=owned.filter(event=>!isPast(event));
  const archived=owned.filter(isPast).reverse();
  const plans=events.filter(event=>!isPast(event)&&(event.joined||event.saved||event.waitlisted));
  return `<h1>${t("plans")}</h1><h2>${t("own")}</h2>${active.map(event=>card(event)).join("")||`<p>${t("none")}</p>`}
    ${link("create","#create","primary")}
    <div class="card"><h2>${t("expired")}</h2>${archived.map(event=>card(event,link("repeat",`#create/repeat/${Number(event.id)}`))).join("")||`<p>${t("none")}</p>`}</div>
    <div class="card"><h2>${t("saved")}</h2>${plans.map(event=>card(event)).join("")||`<p>${t("noPlans")}</p>`}</div>`;
}
function profilePage() {
  return `<div class="rows between account-heading"><h1>${t("profile")}</h1>
    <details class="account-menu"><summary aria-label="${t("accountMenu")}"><span aria-hidden="true">☰</span></summary>
      <div class="account-menu-panel">
        ${link("plans","#plans")}${link("notices","#notices")}${link("contact","mailto:t.davor@gmail.com")}
        ${action(t("passwordLabel"),'data-account-section="profile-password"')}
        ${blockedPeople.length?action(t("blockedPeople"),'data-account-section="profile-blocked"'):""}
        ${base?action(t("deleteAccount"),'data-account-section="profile-delete"',"danger"):""}
        ${!demo&&window.HangaAndroid?`${action(t("alertsOn"),"data-alerts-on")}${action(t("alertsOff"),"data-alerts-off")}
          <small class="muted">${t("localAlertsNote")}</small>`:""}
        ${action(t("logout"),"data-logout")}
      </div>
    </details></div>
    ${blockedPeople.length?`<details id="profile-blocked" hidden><summary>${t("blockedPeople")}</summary>${blockedPeople.map(p=>
      `<p>${esc(p.name)} ${action(t("unblockPerson"),`data-block-person="${Number(p.id)}" data-value="false"`)}</p>`).join("")}</details>`:""}
    <form data-form="profile">
      ${field("name","name",user.name,"text",'required maxlength="80"')}${field("email","email",user.email,"email","required")}
      ${areaSelect(user.area)}${textArea("bio","bio",user.bio,'maxlength="1500"')}
      ${field("interests","interests",user.interests,"text",'maxlength="300"')}

      <details id="profile-password" hidden><summary>${t("passwordLabel")}</summary>${passwordField("current","current")}
      ${passwordField("newPassword","newPassword",{policy:true,autocomplete:"new-password"})}</details>
      <button class="primary">${t("save")}</button></form>
      ${base?`<details id="profile-delete" hidden><summary class="danger">${t("deleteAccount")}</summary><form data-form="deleteAccount">
        ${passwordField("current","password",{required:true})}<button class="danger">${t("deleteAccount")}</button>
      </form></details>`:""}`;
}
function adminPage() {
  return `<h1>${t("admin")}</h1><section class="card"><h2>${t("eventTemplates")}</h2>
    <div class="actions">${starterMeetups.map((draft,index)=>`<a class="action" href="#create/draft/${index}">${esc(draft.title[lang==="en"?1:0])}</a>`).join("")}</div></section>
    <form data-form="registration"><label class="check">
    <input type="checkbox" name="registration" ${admin.registration?"checked":""}> ${t("registration")}
    </label><button class="primary">${t("save")}</button></form>
    <h2>${t("reports")} · ${(admin.reports||[]).filter(r=>!r.resolved).length}</h2>
    ${(admin.reports||[]).map(r=>`<article class="card"><strong>${esc(r.context)}</strong>
      <p>${esc(r.reason)}</p><p>#${Number(r.subject||0)} · ${esc((admin.users.find(u=>u.id===r.subject)||{}).name||"")}</p>
      <div class="actions">${r.event_id?link("details",`#event/${Number(r.event_id)}`):""}
      ${r.resolved?t("resolved"):action(t("resolve"),`data-resolve="${Number(r.id)}"`)}</div></article>`).join("")}
    <h2>${t("accounts")} · ${admin.users.length}</h2>${admin.users.map(u=>`<article class="card">
    <strong>${esc(u.name)}</strong><p class="muted">${esc(u.email)} · ${esc(u.area)}</p>
    ${u.admin?t("admin"):`<div class="actions">${action(t(u.blocked?"unblock":"block"),`data-account="${Number(u.id)}" data-op="block" data-value="${!u.blocked}"`)}
    ${action(t("delete"),`data-account="${Number(u.id)}" data-op="delete"`,"danger")}</div>`}</article>`).join("")}
    <h2>${t("events")} · ${events.length}</h2>${events.map(e=>card(e,action(t("deleteEvent"),`data-event="${Number(e.id)}" data-op="delete"`,"danger"))).join("")}`;
}
function messagesPage() {
  return `<h1>${t("messages")}</h1>${demo?`<p class="muted">${t("messageDemo")}</p>`:""}${action(t("refresh"),"data-refresh")}`+
    (messageList.length?messageList.map(m=>`<article class="card"><h2>${esc(m.title)}</h2>
      <p class="muted">${esc(m.sender_name)} → ${esc(m.recipient_name)} · ${esc(dateLabel(m.created))}</p>
      <p>${esc(m.body)}</p>${link("reply",`#event/${Number(m.event_id)}/${m.sender===user.id?m.recipient:m.sender}`)}${safetyActions(m.sender===user.id?m.recipient:m.sender,"message",m.id)}</article>`).join(""):`<p>${t("noMessages")}</p>`);
}
function noticesPage() {
  return `<h1>${t("notices")}</h1>${action(t("refresh"),"data-refresh")}`+
    (noticeList.length?noticeList.map(n=>`<article class="card"><h2><a href="#event/${Number(n.event_id)}">${esc(n.title)}</a></h2>
      <p>${esc(n.name)} ${t(n.kind==="message"?"messageNotice":n.kind)} · ${esc(dateLabel(n.created))}</p></article>`).join(""):`<p>${t("noNotices")}</p>`);
}
document.addEventListener("input",event=>{
  if (event.target.form?.id==="filter") {
    filters=Object.fromEntries(new FormData(event.target.form));
    eventPageIndex=0;
    refreshResults();
  }
  if (event.target.name==="area" && $("customArea") && event.target.form?.id!=="filter") {
    const custom=event.target.value==="other";
    $("customArea").hidden=!custom;
    $("customArea").querySelector("input").required=custom;
  }
});
document.addEventListener("submit",async event=>{
  event.preventDefault();
  const form=event.target, mode=form.dataset.form;
  if (!mode) return;
  const data=Object.fromEntries(new FormData(form));
  if (data.area==="other") data.area=data.customArea?.trim()||"";
  delete data.customArea;
  const button=form.querySelector("button:not([type=button])");
  button.disabled=true;
  try {
    if (mode==="settings") {
      await disableAlerts();
      await hangaCloud.connect(data.url,data.key.trim());
      if (!hangaCloud.signedIn) session();
      base=hangaCloud.configuration.url;
      cityItems=[];
      cityLoadedAt=0;
      cityUnavailable=false;
      events=[];
      browseOrder.clear();
      eventPageIndex=0;
      location.hash="discover";
    } else if (mode==="login"||mode==="register") {
      if (mode==="register" && !passwordValid(data.password)) throw new Error("password");
      data.adult=data.adult==="on";
      pendingEmail=data.email.trim().toLowerCase();
      const response=await api("/"+mode,data);
      if (response.confirmation) {
        location.hash="auth/confirm";
        return status("codeSent");
      }
      session(response);
      pendingEmail="";
      const city=route()[2];
      location.hash=mode==="login" && cityId.test(city||"")?`create/city/${city}`:"profile";
    } else if (mode==="reset") {
      pendingEmail=data.email.trim().toLowerCase();
      await api("/password/reset",{email:pendingEmail,locale:lang});
      if (form.isConnected) location.hash="auth/reset-sent";
      return;
    } else if (mode==="report") {
      const {type,id}=form.dataset;
      await api("/report",{[{event:"id",person:"person",message:"message"}[type]]:Number(id),reason:data.reason});
      history.back();
    } else if (mode==="reminder") {
      const e=events.find(event=>event.id===Number(form.dataset.id));
      if (!e || !eligibleReminder(e)) throw new Error("missing");
      const minutes=data.off==="on"?0:Number(data.minutes);
      if (!Number.isInteger(minutes) || minutes<0 || minutes>10080) throw new Error("invalid");
      localStorage.setItem(reminderKey(e.id),String(minutes));
      syncReminders();
      if (minutes>0 && window.HangaAndroid) window.HangaAndroid.requestReminderPermission();
    } else if (mode==="event") {
      const original=events.find(entry=>entry.id===Number(form.dataset.id));
      data.start=original && localDate(new Date(original.start))===data.start ? original.start : stockholmDate(data.start);
      data.quick=data.quick==="on";
      data.newcomers=data.newcomers==="on";
      data.price=Number(data.price||0);
      data.capacity=Number(data.capacity||6);
      if (data.quick && (new Date(data.start)>new Date(Date.now()+86400000) || new Date(data.start)<=new Date())) throw new Error("quickTime");
      const id=form.dataset.id;
      const result=await api(id?`/events/${id}/edit`:"/events",data);
      location.hash=id||result.id?`event/${id||result.id}`:"plans";
    } else if (mode==="profile") {
      if (data.newPassword && !passwordValid(data.newPassword)) throw new Error("password");
      data.languages=user.languages||"";
      if (!demo && (data.email.toLowerCase()!==user.email || data.newPassword) && !data.current) {
        $("profile-password").hidden=false;
        $("profile-password").open=true;
        form.querySelector('[name="current"]').focus();
        throw new Error("badLogin");
      }
      user=await api("/me",data);
      syncAlertProfile();
      if (user.emailPending) {
        render();
        return status("emailPending");
      }
    } else if (mode==="registration") {
      await api("/admin/settings",{registration:data.registration==="on"});
    } else if (mode==="deleteAccount") {
      if (!confirm(t("confirmDelete"))) return;
      await disableAlerts();
      await api("/account/delete",{...data,email:user.email});
      session();
      location.hash="discover";
    } else if (mode==="message") {
      await api(`/events/${form.dataset.id}/message`,{recipient:Number(form.dataset.recipient),body:data.body});
      location.hash="messages";
    }
    status("done");
    await load();
  } catch(error) {
    status(error.message);
  }
  finally { button.disabled=false; }
});
function confirmMeetupDeletion(meetup) {
  const dialog=$("delete-meetup-dialog");
  if (dialog.open) return Promise.resolve(false);
  $("delete-meetup-title").textContent=t("confirmEventDelete");
  $("delete-meetup-name").textContent=eventTitle(meetup);
  $("keep-meetup").textContent=t("keepMeetup");
  $("delete-meetup").textContent=t("deleteEvent");
  dialog.returnValue="";
  return new Promise(resolve=>{
    dialog.addEventListener("close",()=>resolve(dialog.returnValue==="delete"),{once:true});
    dialog.showModal();
  });
}
$("keep-meetup").addEventListener("click",()=>$("delete-meetup-dialog").close());
$("delete-meetup").addEventListener("click",()=>$("delete-meetup-dialog").close("delete"));

async function deleteMeetup(id) {
  const meetup=events.find(event=>event.id===id);
  if (!meetup) throw new Error("missing");
  if (!await confirmMeetupDeletion(meetup)) return;
  try {
    await api(`/events/${id}/delete`,{});
  } catch (error) {
    if (error.message!=="missing") throw error;
  }
  events=await api("/events");
  syncReminders();
  if (events.some(event=>event.id===id)) {
    render();
    throw new Error("eventDeleteIncomplete");
  }
  if (route()[0]==="event" && Number(route()[1])===id) location.hash=user.admin?"admin":"plans";
  else render();
  status("eventDeleted");
}

document.addEventListener("click",async event=>{
  if (event.target.closest('.settings-menu a[href="#discover"]') && route()[0]==="discover") {
    event.preventDefault();
    event.target.closest("details").open=false;
    window.scrollTo(0,0);
    void load();
    return;
  }
  document.querySelectorAll(".account-menu[open]").forEach(menu=>{
    if (!menu.contains(event.target) || event.target.closest("a")) menu.open=false;
  });
  const button=event.target.closest("button[type=button]");
  if (!button) return;
  const d=button.dataset;
  if (d.accountSection) {
    button.closest(".account-menu").open=false;
    const section=$(d.accountSection);
    section.hidden=false;
    section.open=true;
    section.querySelector("summary").focus();
    return;
  }
  if ("passwordToggle" in d) {
    const input=button.parentElement.querySelector("input");
    const show=input.type==="password";
    input.type=show?"text":"password";
    button.setAttribute("aria-pressed",String(show));
    button.setAttribute("aria-label",t(show?"passwordHide":"passwordShow"));
    return;
  }
  if ("forgotPassword" in d) {
    pendingEmail=document.querySelector('[data-form="login"] [name="email"]').value.trim();
    location.hash="auth/reset";
    return;
  }
  if ("browseEvents" in d) {
    filters={...defaultFilters};
    const filterForm=$("filter");
    filterForm.elements.query.value=filters.query;
    filterForm.elements.area.value=filters.area;
    filterForm.elements.category.value=filters.category;
    filterForm.elements.period.value=filters.period;
    if (filterForm.elements.eventSource) filterForm.elements.eventSource.value="";
    filterForm.elements.newcomers.checked=false;
    filterForm.closest("details").open=false;
    eventPageIndex=0;
    refreshResults();
    focusEventList();
    void load();
    return;
  }
  if (d.eventPage) {
    eventPageIndex+=Number(d.eventPage);
    refreshResults();
    focusEventList();
    return;
  }
  if ("checkUpdates" in d) {
    window.HangaAndroid.checkForUpdate(lang);
    return;
  }
  button.disabled=true;
  try {
    if ("allowReminder" in d) {
      window.HangaAndroid.allowReminders();
      return;
    } else if ("preciseReminder" in d) {
      window.HangaAndroid.allowPreciseReminders();
      return;
    } else if (d.share || d.shareCity) {
      const e=d.shareCity?findCity(d.shareCity):events.find(entry=>entry.id===Number(d.share));
      if (!e) throw new Error("missing");
      const invite=e.city?`${t("cityInvite")}\n${e.title}\n${dateLabel(e.start)}${e.place?" · "+e.place:""}\n${e.source}`:
        `Hänga Gbg · ${eventTitle(e)}\n${dateLabel(e.start)} · ${e.place}, ${e.area}\n${e.description||""}${e.source?"\n"+e.source:""}`;
      if (window.HangaAndroid) window.HangaAndroid.shareText(invite);
      else if (navigator.share) await navigator.share({text:invite});
      else throw new Error("shareFailed");
      return;
    } else if ("alertsOn" in d) {
      await disableAlerts();
      const currentEvents=await api("/events");
      const latest=currentEvents.reduce((max,event)=>Math.max(max,Number(event.id)),0);
      const registration=await api("/alerts/on",{});
      localStorage.hangaAlertToken=registration.token;
      const {url}=hangaCloud.configuration;
      window.HangaAndroid.startAlerts(url,registration.token,String(registration.cursor),lang,String(user.id),user.area||"",String(latest));
    } else if ("alertsOff" in d) {
      await disableAlerts();
    } else if (d.blockPerson) {
      await api("/blocks/change",{id:Number(d.blockPerson),enabled:d.value==="true"});
    } else if (d.resolve) {
      await api("/reports/resolve",{id:Number(d.resolve)});
    } else if ("resend" in d) {
      await api("/resend",{});
      return status("codeSent");
    } else if ("demo" in d && demo) {
      session(await api("/demo"));
      location.hash="discover";
    } else if ("logout" in d) {
      try { await disableAlerts(); await api("/logout",{}); }
      finally { session(); location.hash="discover"; }
    } else if (d.event || d.account) {
      if (d.event && d.op==="delete") {
        await deleteMeetup(Number(d.event));
        return;
      }
      if (d.op==="delete" && !confirm(t("confirmDelete"))) return;
      if (d.op==="cancel" && !confirm(t("confirmCancel"))) return;
      const value=d.value==="true";
      const result=await api(d.event?`/events/${d.event}/${d.op}`:`/admin/users/${d.account}/${d.op}`,
        d.op==="participants"?undefined:{enabled:value,hidden:value,blocked:value});
      if (d.op==="participants") {
        const e=events.find(item=>item.id===Number(d.event));
        const canMessage=e&&!e.cancelled&&!e.hidden&&(e.joined||e.owner===user.id);
        if ($("participants")) $("participants").innerHTML=result.length?result.map(person=>
          `<div class="card"><p>${esc(person.name)}</p>${person.id!==user.id&&canMessage?link("message",`#event/${d.event}/${Number(person.id)}`):""}${safetyActions(person.id,"person",person.id)}</div>`).join(""):`<p>${t("waiting")}</p>`;
        return;
      }
      if (d.event && d.op==="join" && value && window.HangaAndroid) {
        window.HangaAndroid.requestReminderPermission();
      }
      status("done");
    }
    await load();
  } catch(error) { status(error.message); }
  finally { button.disabled=false; }
});
document.addEventListener("change",event=>{
  if (event.target.name!=="appLanguage" || !["sv","en"].includes(event.target.value)) return;
  localStorage.lang=lang=event.target.value;
  syncAlertProfile();
  window.hangaRefreshReminders();
  render();
});
setInterval(()=>{
  if (route()[0]!=="discover" || !$("results")) return;
  refreshResults();
  if (document.visibilityState!=="hidden") loadCityCalendar()?.then(()=>{
    if ($("results")) refreshResults();
  });
},30000);
window.addEventListener("hashchange",()=>{ window.scrollTo(0,0); render(); load(); });
render();
load();
