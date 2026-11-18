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
