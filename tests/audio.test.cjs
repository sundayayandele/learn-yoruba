const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function setup(){
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  script=script.replace('render();\n})();','globalThis.api={GREETING_AUDIO,LESSONS,playAudio,stopAudio,audioControls,learn,lessonView,render,go,player:audioPlayer,state:()=>audioState,setQuestion(q,fb){L={qs:[q],qi:0,done:0,initial:1,hearts:5,sel:-1,picked:[],fb};},setLearn(){V={name:"learn",i:0};}};\nrender();\n})();');
  const app={innerHTML:''};const notices=[];
  class Audio{constructor(){this.events={};this.calls=0;}pause(){}load(){}removeAttribute(){this.src='';}addEventListener(k,f){this.events[k]=f;}play(){this.calls++;return this.result||Promise.resolve();}}
  const context={Audio,URL,console,setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null},window:{scrollTo(){},addEventListener(){}},document:{baseURI:'https://example.github.io/learn-yoruba/',getElementById:()=>app,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},createElement:()=>({setAttribute(){}}),body:{appendChild(d){notices.push(d.textContent);}}}};
  vm.createContext(context);vm.runInContext(script,context);return {...context.api,app,notices};
}
test('pending recordings do not request audio and only first lesson has controls',()=>{
 const a=setup();a.setLearn();assert.equal((a.learn().match(/Recording coming soon/g)||[]).length,5);
 a.playAudio('greeting-morning');assert.equal(a.player.calls,0);assert.equal(a.audioControls(a.LESSONS[1].items[0]),'');
});
test('reviewed clip uses project-relative URL and survives re-render',async()=>{
 const a=setup();a.GREETING_AUDIO[0].ready=true;a.playAudio('greeting-morning');await Promise.resolve();
 assert.equal(a.player.src,'https://example.github.io/learn-yoruba/audio/yo/greeting-morning.mp3');
 a.render();assert.equal(a.state(),'playing');a.go('home');assert.equal(a.state(),'idle');
});
test('stale play rejection cannot stop a newer recording',async()=>{
 const a=setup();a.GREETING_AUDIO.forEach(x=>x.ready=true);let reject;
 a.player.result=new Promise((_,r)=>reject=r);a.playAudio('greeting-morning');
 a.player.result=Promise.resolve();a.playAudio('greeting-afternoon');reject(new Error('interrupted'));
 await Promise.resolve();await Promise.resolve();assert.equal(a.state(),'playing');assert.equal(a.notices.length,0);
});
test('playback failure shows a recoverable message',async()=>{
 const a=setup();a.GREETING_AUDIO[0].ready=true;a.player.result=Promise.reject(new Error('blocked'));
 a.playAudio('greeting-morning');await Promise.resolve();await Promise.resolve();
 assert.equal(a.state(),'idle');assert.match(a.notices[0],/try again/);
});
test('translation answers have audio only after checking',()=>{
 const a=setup();a.GREETING_AUDIO[0].ready=true;const q={type:'pickYo',it:a.LESSONS[0].items[0],opts:[{t:'test',c:true}]};
 a.setQuestion(q,null);assert.doesNotMatch(a.lessonView(),/data-act="play-audio"/);
 a.setQuestion(q,{ok:true,msg:'Correct'});assert.match(a.lessonView(),/data-act="play-audio"/);
});
