import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../../app/src/main/assets/app.js',import.meta.url),'utf8').replace(/render\(\);\nload\(\);\s*$/,'');
function ui() {
  const context=vm.createContext({Intl,Date,URL,URLSearchParams,console,
    setInterval(){},setTimeout(){},clearTimeout(){},
    localStorage:{getItem(){return null;},removeItem(){},setItem(){}},
    window:{addEventListener(){}},document:{addEventListener(){},getElementById(){return {addEventListener(){}};}},location:{hash:'#event/10'},
    hangaCloud:{forget(){},configuration:{url:'https://example.test',key:'test'},signedIn:true}});
  const run=js=>vm.runInContext(js,context);
  run(source);
  run(`user={id:1,name:'Davor',area:'Centrum',email:'hidden@example.test',admin:false};
    events=[{id:10,owner:2,organizer:'Anna',joined:true,title:'Walk',area:'Centrum',place:'Park',description:'Hello',category:'walk',capacity:6,count:2,price:0,start:new Date(Date.now()+3600000).toISOString(),end:new Date(Date.now()+7200000).toISOString(),meetingNote:'Blue jacket',meetingMap:'https://maps.app.goo.gl/example'}];`);
  return run;
}

test('meetup actions are contextual, group content is escaped and does not cross conversations',()=>{
  const run=ui();
  let html=run('eventPage(events[0])');
  assert.match(html,/Gruppchatt/);assert.match(html,/Jag kommer/);assert.match(html,/Blue jacket/);
  html=run('events[0].joined=false;eventPage(events[0])');
  assert.doesNotMatch(html,/#group\/10/);
  html=run(`location.hash='#group/10';groupEventId=10;groupRows=[{id:20,sender:2,name:'Anna',body:'<script>bad()</script>',created:new Date().toISOString()}];groupContent()`);
  assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);
  assert.doesNotMatch(run("location.hash='#group/11';groupContent()"),/bad/);
});

test('recurrence, meeting fields, following and private feedback have Swedish and English labels',()=>{
  const run=ui();
  for(const lang of ['sv','en']) {
    run(`lang='${lang}'`);
    let html=run('eventForm()');
    assert.match(html,/name="repeatCount"/);assert.match(html,/name="meetingNote"/);assert.match(html,/name="end"/);
    html=run(`memberProfile={id:2,name:'Anna',bio:'Walks',languages:'Svenska, English',following:false};memberPage(2)`);
    assert.match(html,/data-follow="2"/);assert.doesNotMatch(html,/@/);
    html=run(`events[0].start=new Date(Date.now()-7200000).toISOString();events[0].end=new Date(Date.now()-3600000).toISOString();feedbackPage(10)`);
    assert.match(html,/data-form="feedback"/);assert.match(html,/value="" selected/);
  }
  run('session()');
  assert.equal(run('groupRows.length+followingPeople.length+availability.length'),0);
});

test('private conversation exposes personal message and history deletion with explanatory copy',()=>{
  const run=ui();
  run(`messageList=[{id:100,event_id:10,sender:2,recipient:1,sender_name:'Anna',recipient_name:'Davor',body:'Hello',created:new Date().toISOString()}]`);
  for(const lang of ['sv','en']) {
    const html=run(`lang='${lang}';chatContent(2)`);
    assert.match(html,/data-delete-chat="2" data-through="100"/);
    assert.match(html,/data-delete-message="100" data-peer="2"/);
    assert.ok(run('t("deleteConversationConfirm")').length>60);
    assert.ok(run('t("deleteMessageConfirm")').length>30);
  }
});

test('own availability always has edit and delete actions on home and a prefilled edit form',()=>{
  const run=ui();
  run(`availability=Array.from({length:6},(_,i)=>({user_id:i+2,name:'Other '+i,area:'Centrum',activity:'fika',from:new Date().toISOString(),until:new Date(Date.now()+600000).toISOString()}));
    availability.push({user_id:'1',name:'Davor',area:'Tuve',activity:'walk',from:new Date().toISOString(),until:new Date(Date.now()+600000).toISOString()});`);
  for(const lang of ['sv','en']) {
    const home=run(`lang='${lang}';todayCompany()`);
    assert.match(home,/my-availability/);assert.match(home,/data-remove-availability/);assert.match(home,/href="#availability"/);
    const edit=run('availabilityPage()');
    assert.match(edit,/value="Tuve" selected/);assert.match(edit,/value="walk" selected/);assert.match(edit,/data-remove-availability/);
  }
  const other=run('availability=availability.filter(e=>Number(e.user_id)!==1);todayCompany()');
  assert.doesNotMatch(other,/data-remove-availability/);
});

test('availability save and delete refresh local state even when already on the discover route',async()=>{
  const run=ui();
  run(`location.hash='#discover';globalThis.operations=[];globalThis.renderCount=0;
    render=()=>{renderCount++};status=key=>{globalThis.lastStatus=key};globalThis.confirm=()=>true;
    globalThis.rows=[{user_id:2,name:'Anna',area:'Tuve',activity:'walk',from:new Date().toISOString(),until:new Date(Date.now()+600000).toISOString()}];
    api=async(path,data)=>{operations.push({path,data});if(data?.enabled===false)rows=rows.filter(e=>e.user_id!==1);else if(data)rows=[...rows.filter(e=>e.user_id!==1),{...data,user_id:1,name:'Davor'}];return rows};`);
  await run(`saveAvailability({area:'Centrum',activity:'fika',day:localDate(new Date()).slice(0,10),from:'18:00',until:'00:00'})`);
  assert.equal(run('ownAvailability().area'),'Centrum');
  assert.equal(run('lastStatus'),'availabilitySaved');
  assert.equal(run('localDate(new Date(operations[0].data.until)).slice(11)'),'00:00');
  await run('removeAvailability()');
  assert.equal(run('availability.length'),1);
  assert.equal(run('ownAvailability()'),undefined);
  assert.equal(run('renderCount'),2);
  assert.equal(run('lastStatus'),'availabilityRemoved');
});

test('expired imported events are pruned and the visible city page refreshes at event end',()=>{
  const run=ui();
  run(`globalThis.testNow=Date.parse('2026-11-19T12:00:00Z');Date=class extends Date{static now(){return testNow}};
    globalThis.updates=0;render=()=>{updates++};globalThis.nextExpiry=null;
    setTimeout=(fn,delay)=>{nextExpiry={fn,delay};return 1};
    location.hash='#city/47e827a0-cb0d-4578-bff8-ef4c0041561e';
    globalThis.activeCity={id:'47e827a0-cb0d-4578-bff8-ef4c0041561e',title:'Exhibition',place:'Museum',organizer:'City',source:cityPortal+'47e827a0-cb0d-4578-bff8-ef4c0041561e',start:'2026-11-19T11:00:00Z',end:'2026-11-19T13:00:00Z',city:true};
    cityItems=[activeCity,{...activeCity,id:'3dbc5ddb-6b09-43e7-ba70-f03fcd3a3376',source:cityPortal+'3dbc5ddb-6b09-43e7-ba70-f03fcd3a3376',end:'2026-11-19T11:30:00Z'}];
    pruneCityEvents();scheduleCityExpiry();`);
  assert.equal(run('cityItems.length'),1);
  assert.equal(run('nextExpiry.delay'),3600020);
  assert.match(run('cityCard(activeCity)'),/Pågår nu/);
  assert.match(run('cityCard(activeCity)'),/ – /);
  assert.match(run("lang='en';cityCard(activeCity)"),/Ongoing now/);
  run('testNow=Date.parse(activeCity.end);nextExpiry.fn()');
  assert.equal(run('cityItems.length'),0);
  assert.equal(run('updates'),1);
  assert.equal(run('findCity(activeCity.id)'),undefined);
});

test('idea actions replace RSVP controls until confirmed and are discoverable beside each event',()=>{
  const run=ui();
  run(`events[0]={...events[0],joined:false,minPeople:3,proposalPhase:'collecting',interestCount:1,count:0}`);
  let html=run('eventPage(events[0])');
  assert.match(html,/data-interest="10"/);assert.doesNotMatch(html,/data-op="join"/);assert.doesNotMatch(html,/#group\/10/);
  html=run(`events[0].interested=true;events[0].proposalPhase='confirming';eventPage(events[0])`);
  assert.match(html,/data-confirm-proposal="10"/);
  html=run(`events[0].proposalPhase='active';events[0].joined=true;eventPage(events[0])`);
  assert.doesNotMatch(html,/data-interest=/);assert.match(html,/#group\/10/);
});

test('walk ideas prefill usable descriptions and goals in both languages, and atmosphere filters the list',()=>{
  const run=ui();
  for(const lang of ['sv','en']) {
    run(`lang='${lang}'`);
    const html=run('eventForm(null,walkTemplates().photo)');
    assert.match(html,/value="photo" selected/);assert.match(html,/name="meetupMode"/);
    assert.ok(run(`walkTemplates().photo.description[lang==='en'?1:0].length`)>100);
    assert.equal(run('Object.keys(walkTemplates()).length'),4);
  }
  run(`events=[{...events[0],title:'Quiet meetup',mood:'chill'},{...events[0],id:11,title:'Talking meetup',mood:'social'}];filters={...defaultFilters,mood:'chill'};cityItems=[]`);
  const html=run('results()');assert.match(html,/Quiet meetup/);assert.doesNotMatch(html,/Talking meetup/);
});

test('meet-again is a contextual post-event screen with private selection and mutual-only contact actions',()=>{
  const run=ui();
  run(`events[0].start=new Date(Date.now()-7200000).toISOString();events[0].end=new Date(Date.now()-3600000).toISOString();againEventId=10;againRows=[{id:2,name:'Anna',selected:false,matched:false}]`);
  const event=run('eventPage(events[0])');assert.match(event,/#again\/10/);
  let html=run('againPage(10)');assert.match(html,/data-again="10"/);assert.doesNotMatch(html,/#event\/10\/2/);
  html=run('againRows[0].matched=true;againPage(10)');assert.match(html,/#messages\/2/);assert.match(html,/#friends\/invite\/2/);assert.doesNotMatch(html,/data-again=/);
});

test('proposal progress and a reciprocal meet-again choice refresh on the current screen',async()=>{
  const run=ui();
  run(`location.hash='#event/10';events[0]={...events[0],minPeople:3,proposalPhase:'collecting',joined:false};globalThis.rendered=0;render=()=>{rendered++};api=async()=>[{...events[0],interestCount:2,proposalPhase:'confirming'}]`);
  await run('refreshSocialPage()');
  assert.equal(run('events[0].proposalPhase'),'confirming');
  run(`location.hash='#again/10';againEventId=10;againRows=[{id:2,name:'Anna',selected:true,matched:false}];api=async()=>[{id:2,name:'Anna',selected:true,matched:true}]`);
  await run('refreshSocialPage()');
  assert.equal(run('againRows[0].matched'),true);
  assert.equal(run('rendered'),2);
});

test('friends live inside messages, new friend chats have a composer and invitations use attended events only',()=>{
  const run=ui();
  run(`friends=[{id:2,name:'Anna',bio:'Hello',languages:'Svenska',status:'accepted',direction:'incoming'},{id:3,name:'Bob',status:'pending',direction:'incoming'}]`);
  let html=run('friendsPage()');
  assert.match(html,/#messages/);assert.match(html,/#friends\/invite\/2/);assert.match(html,/data-friend-reply="3"/);
  html=run('messagesPage(2)');assert.match(html,/data-peer="2" >/);assert.match(html,/Anna/);
  assert.doesNotMatch(html,/data-peer="2" hidden/);
  run(`events=[{...events[0],owner:2,joined:false},{...events[0],id:11,joined:true},{...events[0],id:12,owner:1,joined:false}]`);
  html=run('friendInvitePage(2)');assert.match(html,/value="11"/);assert.match(html,/value="12"/);assert.doesNotMatch(html,/value="10"/);
});

test('friend requests refresh on the list without resetting an open invitation form',async()=>{
  const run=ui();
  run(`location.hash='#friends';globalThis.updates=0;render=()=>{updates++};friends=[];api=async()=>[{id:2,name:'Anna',status:'pending',direction:'incoming'}]`);
  await run('refreshSocialPage()');
  assert.equal(run('friends.length'),1);assert.equal(run('updates'),1);
  run(`location.hash='#friends/invite/2';api=()=>{throw new Error('Do not reset an invitation')}`);
  await run('refreshSocialPage()');assert.equal(run('updates'),1);
});

test('a late friend-list response cannot restore another account’s contacts after switching accounts',async()=>{
  const run=ui();
  run(`location.hash='#friends';globalThis.finishFriends=null;api=()=>new Promise(resolve=>{finishFriends=resolve});render=()=>{}`);
  const pending=run('load()');
  run(`user={id:9,name:'Other account'};friends=[];finishFriends([{id:2,name:'Private old contact',status:'accepted'}])`);
  await pending;
  assert.equal(run('friends.length'),0);
});

test('admin panel links active users to private chats and admin messages have a clear sender label',()=>{
  const run=ui();
  run(`user.admin=true;admin={registration:true,reports:[],feedback:[],users:[{id:1,name:'Davor',admin:true},{id:2,name:'Anna'},{id:3,name:'Blocked',blocked:true},{id:4,name:'Other admin',admin:true}]};events=[]`);
  const panel=run('adminPage()');
  assert.match(panel,/#messages\/2/);assert.match(panel,/#messages\/4/);
  assert.doesNotMatch(panel,/#messages\/1/);assert.doesNotMatch(panel,/#messages\/3/);
  run(`chatPeer={id:2,name:'Anna',adminContact:true,canSend:true};messageList=[{id:100,sender:1,recipient:2,sender_name:'Davor',recipient_name:'Anna',body:'Admin hello',admin_message:true,created:new Date().toISOString()}]`);
  assert.match(run('chatContent(2)'),/Från administratören/);
  run(`messageList=[]`);
  assert.equal(run('canCompose(2)'),true);
  assert.match(run(`lang='en';chatContent(2)`),/Private contact between the administrator/);
});


test('chat keeps message actions collapsed, puts friend shortcut beside inbox and uses a compact composer',()=>{
  const run=ui();
  run(`messageList=[{id:100,sender:2,recipient:1,sender_name:'Anna',recipient_name:'Davor',body:'<hello>',created:new Date().toISOString()},{id:101,sender:1,recipient:2,sender_name:'Davor',recipient_name:'Anna',body:'Hi',created:new Date().toISOString()}];chatPeer={id:2,canSend:true,friend:true};`);
  for(const language of ['sv','en']) {
    const html=run(`lang='${language}';messagesPage(2)`);
    assert.match(html,/chat-group chat-own/);
    assert.match(html,/role="log"/);
    assert.match(html,/&lt;hello&gt;/);
    assert.match(html,/<details class="message-options"><summary[^>]*>⋮<\/summary><div class="message-options-panel">/);
    assert.doesNotMatch(html,/<details[^>]* open/);
    assert.match(html,/id="chat-body" name="body"/);
    assert.match(html,/data-delete-chat="2"/);
    assert.equal((html.match(/#report\/message\/100/g)||[]).length,1);
    assert.doesNotMatch(html,/#report\/message\/101/);
  }
  run(`globalThis.nodes={};document.documentElement={};document.querySelector=()=>null;document.getElementById=id=>nodes[id]||(nodes[id]={parentElement:{setAttribute(){}},querySelector(){return null}});location.hash='#messages';render()`);
  const header=run('nodes["header-actions"].innerHTML');
  assert.match(header,/messages-shortcut[\s\S]*friends-shortcut[\s\S]*settings-menu/);
  assert.match(header,/href="#notices"/);
});

test('redesign keeps essential routes, visible search, safe friend rows and logo-backed splash resources',()=>{
  const run=ui();
  for(const language of ['sv','en']) {
    run(`lang='${language}'`);
    const home=run('discoverPage()');
    assert.match(home,/id="filter"/);
    assert.match(home,/name="query" type="search"/);
    assert.match(home,/data-toggle-filters[^>]*><svg/);
    assert.doesNotMatch(home,/&lt;svg/);
    assert.match(home,/data-category="walk"/);
    assert.doesNotMatch(home,/buymeacoffee.com/);
    assert.match(home,/class="action primary create-meetup" href="#create"/);
    for(const category of run("cats")) assert.match(home,new RegExp('data-category="'+category+'"'));
    assert.match(run('headerNavigation("discover")'),/buymeacoffee.com\/wjkrddbhyx/);
    assert.match(home,/id="advanced-filters"/);
    assert.ok(home.indexOf(run('t("userCreatedMeetups")'))<home.indexOf('id="filter"'));
    const nav=run('bottomNavigation("plans")');
    assert.match(nav,/#plans" aria-current="page"/);
    for(const route of ['discover','plans','create','profile']) assert.match(nav,new RegExp('href="#'+route+'"'));
    const header=run('headerNavigation("friends")');
    assert.match(header,/href="#friends"[^>]*aria-current="page"/);
    assert.doesNotMatch(header,/href="#admin"/);
    assert.match(run('user.admin=true;headerNavigation("admin")'),/href="#admin"/);
    run('user.admin=false');
  }
  run(`friendSearch='anna';friends=[{id:2,name:'Anna <One>',status:'accepted',bio:'<script>bad</script>'},{id:3,name:'Erik',status:'accepted'}]`);
  const list=run('friendsPage()');
  assert.match(list,/Anna &lt;One&gt;/);assert.doesNotMatch(list,/<script>/);
  assert.match(list,/data-friend-name="erik" hidden/);
  assert.match(list,/#messages\/2/);assert.match(list,/#friends\/invite\/2/);
  run('session()');assert.equal(run('friendSearch'),'');
  const main=readFileSync(new URL('../../app/src/main/java/se/hangagbg/android/MainActivity.java',import.meta.url),'utf8');
  const android12=readFileSync(new URL('../../app/src/main/res/values-v31/styles.xml',import.meta.url),'utf8');
  assert.match(main,/setImageResource\(R.drawable.logo_mark\)/);
  assert.match(android12,/@drawable\/logo_mark/);
  assert.match(main,/web.postDelayed\(\(\) -> hideSplash\(\), 2000\)/);
  assert.doesNotMatch(main,/hideSplash\(\), (120|8000)\)/);
});
