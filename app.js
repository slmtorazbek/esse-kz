const form=document.getElementById('essayForm');
const toast=document.getElementById('toast');
let timer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),3800);}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const topic=document.getElementById('topic').value.trim();
  const count=Number(document.getElementById('count').value);
  if(!topic){notify('Алдымен эссе тақырыбын енгіз.');return;}
  if(!Number.isInteger(count)||count<50||count>3000){notify('Сөз саны 50 мен 3000 аралығында болуы керек.');return;}
  notify('Форма дайын! Келесі кезеңде AI серверін қосамыз. Әзірге эссе генерациясы іске қосылмаған.');
});
document.getElementById('themeBtn').addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  document.getElementById('themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾';
});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
