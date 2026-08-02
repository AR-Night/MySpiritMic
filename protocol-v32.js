(()=>{'use strict';
const $=id=>document.getElementById(id);
const header=document.querySelector('header');
if(!header)return;
const card=document.createElement('section');
card.className='card protocol-card';
card.innerHTML=`
<div class="title">Protocollo guidato EVP · controllo ambientale</div>
<div class="protocol-steps">
  <button data-step="prepare" class="protocol-step active"><b>1</b><span>Prepara</span></button>
  <button data-step="baseline" class="protocol-step"><b>2</b><span>Baseline</span></button>
  <button data-step="questions" class="protocol-step"><b>3</b><span>Domande</span></button>
  <button data-step="review" class="protocol-step"><b>4</b><span>Revisione</span></button>
</div>
<div class="protocol-panel">
  <div><span>Fase corrente</span><strong id="protocolPhase">Preparazione</strong></div>
  <div><span>Timer</span><strong id="protocolClock">—</strong></div>
</div>
<p id="protocolInstruction">Metti l’iPhone in modalità aereo, chiudi porte e finestre, annota persone e sorgenti di rumore. Poi attiva il microfono.</p>
<textarea id="sessionNotes" rows="3" placeholder="Luogo, ora, persone presenti, TV/ventilatori/tubazioni, eventuali rumori noti…"></textarea>
<div class="buttons">
  <button id="protocolPrimary" class="btn secondary">CONTROLLO PREPARAZIONE</button>
  <button id="protocolQuestion" class="btn" disabled>NUOVA DOMANDA</button>
</div>
<div class="protocol-result" id="protocolResult">Nessun protocollo avviato.</div>`;
header.insertAdjacentElement('afterend',card);

const phase=$('protocolPhase'),clock=$('protocolClock'),instruction=$('protocolInstruction'),primary=$('protocolPrimary'),question=$('protocolQuestion'),result=$('protocolResult'),notes=$('sessionNotes');
const start=$('start'),calibrate=$('calibrate'),mark=$('mark'),statusText=$('statusText'),noise=$('noiseFloor'),snr=$('snr');
let current='prepare',timer=null,remaining=0,questionNumber=0;
const labels={prepare:'Preparazione',baseline:'Baseline ambientale',questions:'Sessione domande',review:'Revisione cieca'};
const texts={
prepare:'Metti l’iPhone in modalità aereo, chiudi porte e finestre, annota persone e sorgenti di rumore. Poi attiva il microfono.',
baseline:'Rimani in silenzio durante la calibrazione. Non muovere il telefono e non lasciare persone entrare o uscire.',
questions:'Fai una domanda breve, poi resta in silenzio per 30 secondi. Non suggerire possibili parole durante l’ascolto.',
review:'Ascolta prima l’audio originale, poi le clip. Fai annotare le parole a due persone separatamente e confronta solo alla fine.'};
function setStep(s){current=s;phase.textContent=labels[s];instruction.textContent=texts[s];document.querySelectorAll('.protocol-step').forEach(b=>b.classList.toggle('active',b.dataset.step===s));primary.textContent=s==='prepare'?'CONTROLLO PREPARAZIONE':s==='baseline'?'AVVIA BASELINE 30 S':s==='questions'?'TERMINA SESSIONE':'SALVA NOTE';question.disabled=s!=='questions'||statusText?.textContent==='IN ATTESA';}
function stopTimer(){clearInterval(timer);timer=null;clock.textContent='—';}
function countdown(sec,onDone){stopTimer();remaining=sec;clock.textContent=`00:${String(remaining).padStart(2,'0')}`;timer=setInterval(()=>{remaining--;clock.textContent=`00:${String(Math.max(0,remaining)).padStart(2,'0')}`;if(remaining<=0){stopTimer();onDone?.()}},1000)}
function addProtocolLog(text){const log=$('translationLog')||$('events');if(!log)return;const item=document.createElement('div');item.className='translation-item protocol-log';item.innerHTML=`<time>${$('elapsed')?.textContent||'00:00.0'}</time><div><b>${text}</b><small>protocollo guidato</small></div>`;log.prepend(item);log.querySelector('.empty')?.remove();}
primary.addEventListener('click',()=>{
 if(current==='prepare'){
   notes.value=notes.value.trim();localStorage.setItem('myspiritmic-session-notes',notes.value);
   const active=statusText&&statusText.textContent!=='IN ATTESA';
   result.textContent=active?'Microfono attivo. Procedi con la baseline.':'Attiva il microfono con il pulsante principale, poi procedi con la baseline.';
   setStep('baseline');
 }else if(current==='baseline'){
   if(!calibrate||calibrate.disabled){result.textContent='Prima attiva il microfono.';return}
   calibrate.click();addProtocolLog('Inizio baseline ambientale');countdown(30,()=>{addProtocolLog('Fine baseline ambientale');result.textContent=`Baseline completata. Rumore: ${noise?.textContent||'—'} · S/N: ${snr?.textContent||'—'}`;setStep('questions')});
 }else if(current==='questions'){
   stopTimer();addProtocolLog('Sessione domande terminata');result.textContent='Sessione terminata. Passa alla revisione cieca.';setStep('review');
 }else{
   localStorage.setItem('myspiritmic-session-notes',notes.value);result.textContent='Note salvate sul dispositivo.';
 }
});
question.addEventListener('click',()=>{
 if(statusText?.textContent==='IN ATTESA'){result.textContent='Microfono non attivo.';return}
 questionNumber++;question.disabled=true;mark?.click();addProtocolLog(`Domanda ${questionNumber} · inizio finestra di ascolto`);result.textContent=`Domanda ${questionNumber}: resta in silenzio per 30 secondi.`;
 countdown(30,()=>{mark?.click();addProtocolLog(`Domanda ${questionNumber} · fine finestra di ascolto`);result.textContent=`Finestra ${questionNumber} completata. Puoi fare la domanda successiva.`;question.disabled=false});
});
document.querySelectorAll('.protocol-step').forEach(b=>b.addEventListener('click',()=>{if(!timer)setStep(b.dataset.step)}));
notes.value=localStorage.getItem('myspiritmic-session-notes')||'';
new MutationObserver(()=>{if(current==='questions')question.disabled=statusText?.textContent==='IN ATTESA'}).observe(statusText,{childList:true});
setStep('prepare');
})();