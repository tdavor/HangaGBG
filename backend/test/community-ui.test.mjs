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
