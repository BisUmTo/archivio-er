'use strict';
const form=document.getElementById('student-form'),error=document.getElementById('form-error');
try{const p=OfficinaProfile.current(localStorage);if(p){form.elements.nome.value=p.name;form.elements.classe.value=p.classe;}}catch{}
form.addEventListener('submit',event=>{event.preventDefault();error.textContent='';try{const theme=event.submitter?.value;if(!theme)return;const p=OfficinaProfile.choose(localStorage,form.elements.nome.value,form.elements.classe.value,theme);OfficinaProfile.adoptLegacy(localStorage,p);window.location.href='v3/?tema='+theme;}catch(e){error.textContent=e.message==='Inserisci il tuo nome.'?e.message:'Il browser non consente il salvataggio locale. Abilitalo per registrare il lavoro.';error.focus();}});
