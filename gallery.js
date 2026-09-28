(function(){
const REPO='https://github.com/vany201847dody-art/windowsweb-builds';
const BUILDS=[
 {file:'vssesuperbild.html', st:'ok', badge:'✅ итоговая', name:'Итоговая сборка',
  note:'Финальная рабочая ОС: Пуск, панель задач, Проводник, «Этот компьютер», Банк, QR, Диктофон, Заметки, 5 игр, мировые часы. Хостится на отдельном сайте.'},
 {file:'DEEPSEEK.html', st:'wip', badge:'🟡 рабочий', name:'DeepSeek — источник приложений',
  note:'Отсюда портированы Банк/QR/Диктофон/Заметки/Игры/Мировые часы. Сама по себе сырая: эмодзи вместо иконок, нет доработок оболочки, поиск и Пуск местами не доделаны.'},
 {file:'deepseek.html', st:'bad', badge:'🔴 неудачная', name:'DeepSeek — ранняя',
  note:'Более старая версия той же ветки: окна съезжают, панель задач и часть приложений не работают, много мусорного кода. Оставлена для истории.'},
 {file:'алиса аи.html', st:'bad', badge:'🔴 неудачная', name:'Алиса АИ — ранний концепт',
  note:'Другая архитектура: системные окна почти не работают, Пуск и рабочий стол не собраны. Сохранена как источник идей.'},
 {file:'gigschat.html', st:'bad', badge:'🔴 неудачная', name:'Gigachat — эксперимент',
  note:'Только базовые окна, оболочки нет: Пуск, панель задач и рабочий стол не реализованы. Мелкая заготовка для проверки.'}
];

const BANNED=['бля','хуй','пизд','ебал','ебаш','нахуй','сучка','сука','моча','шлюх','шлюш','пидар','пидор','гандон','мудак','мудил','залуп','херня','падла','тварь','ублюд','говно','дерьмо','сра','блев','пошел на х'];
function mask(s){
  let r=s, l=r.toLowerCase();
  for(const w of BANNED){
    const re=new RegExp(w,'gi');
    if(re.test(l)) r=r.replace(re,bc=>'*'.repeat(bc.length));
  }
  return r;
}

const grid=document.getElementById('grid');
const ov=document.getElementById('ov');
const cv=document.getElementById('cv');
const ovName=document.getElementById('ovName');
const ovLink=document.getElementById('ovLink');

function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function getCmt(file){try{const v=JSON.parse(localStorage.getItem('cmt_'+file)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
function saveCmt(file,arr){try{localStorage.setItem('cmt_'+file,JSON.stringify(arr.slice(-40)))}catch(e){}}
function getProf(){try{return JSON.parse(localStorage.getItem('pt_prof')||'{}')}catch(e){return{}}}
function setProf(p){try{localStorage.setItem('pt_prof',JSON.stringify(p))}catch(e){}}
function hashPass(p){
  try{
    if(window.crypto&&crypto.subtle&&crypto.subtle.digest){
      return crypto.subtle.digest('SHA-256',new TextEncoder().encode('pt'+p)).then(b=>
        Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''));
    }
  }catch(e){}
  let h=5381;for(let i=0;i<p.length;i++)h=((h<<5)+h+p.charCodeAt(i))>>>0;
  return Promise.resolve('fnv'+h);
}
async function ensureOwner(){
  try{if(sessionStorage.getItem('pt_ok')==='1')return true}catch(e){}
  let stored=null;try{stored=localStorage.getItem('pt')}catch(e){}
  if(stored){
    const p=prompt('Пароль владельца для удаления комментариев:');
    if(p==null)return false;
    if((await hashPass(p))===stored)return true;
    alert('Неверный пароль');return false;
  }
  const a=prompt('Пароль владельца не задан. Придумайте (мин. 4 символа):');
  if(!a||a.length<4){alert('Минимум 4 символа');return false}
  const b=prompt('Повторите пароль:');
  if(a!==b){alert('Пароли не совпадают');return false}
  try{localStorage.setItem('pt',await hashPass(a));sessionStorage.setItem('pt_ok','1')}catch(e){}
  return true;
}
function safeLink(u){
  try{const uu=new URL(u);return(uu.protocol==='http:'||uu.protocol==='https:')?uu.href:''}catch(e){return''}
}
function renderCmtList(file,el){
  el.textContent='';
  const arr=getCmt(file);
  if(!arr.length){const d=document.createElement('div');d.className='cmt_empty';d.textContent='Комментариев пока нет';el.appendChild(d);return}
  for(let i=arr.length-1;i>=0;i--){
    const it=arr[i],row=document.createElement('div');row.className='cmt_it';
    if(it.n){
      const href=safeLink(it.l||''),a=document.createElement(href?'a':'span');
      a.className='cprof';
      if(href){a.href=href;a.target='_blank';a.rel='noopener noreferrer'}
      a.textContent=it.n;row.appendChild(a);
    }
    row.appendChild(document.createTextNode((it.t||'')+' · '+(it.x||it.a||'')));
    const del=document.createElement('button');del.type='button';del.className='cmt_del';
    del.title='Удалить (владелец)';del.textContent='✕';
    del.addEventListener('click',async()=>{
      if(!(await ensureOwner()))return;
      saveCmt(file,getCmt(file).filter(c=>c.u!==it.u));renderCmtList(file,el);
    });
    row.appendChild(del);el.appendChild(row);
  }
}
function addCmt(file,raw,form){
  const a=mask(raw.trim()).slice(0,300);
  if(!a)return;
  const p=getProf(),now=new Date();
  const ts=now.toLocaleDateString('ru')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  const arr=getCmt(file);arr.push({u:Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),t:ts,x:a,n:(p.n||'Аноним').slice(0,30),l:(p.l||'').slice(0,200)});saveCmt(file,arr);
  const list=form.parentElement.querySelector('.cmt_list');
  renderCmtList(file,list);form.querySelector('.cmt_in').value='';
}
function initProf(){
  const n=document.getElementById('who_n'),l=document.getElementById('who_l'),p=getProf();
  if(n&&p.n)n.value=p.n;
  if(l&&p.l)l.value=p.l;
  const ok=document.getElementById('who_ok');
  if(ok)ok.addEventListener('click',()=>setProf({n:(n.value||'').trim(),l:(l.value||'').trim()}));
}

function render(){
  grid.innerHTML=BUILDS.map(b=>`
   <div class="card" data-file="${esc(b.file)}">
     <div class="top"><span class="badge b-${b.st}">${b.badge}</span></div>
     <div class="fname">${esc(b.file)}</div>
     <div class="stats">${esc(b.name)}</div>
     <div class="note">${b.note}</div>
     <div class="btns">
       <button class="try">🖱️ Потыкать</button>
       <a class="code" href="${REPO}/blob/main/${encodeURIComponent(b.file)}" target="_blank" rel="noopener noreferrer">Код</a>
     </div>
     <div class="cmt">
       <div class="cmt_head">Комментарии</div>
       <div class="cmt_list"></div>
       <form class="cmt_form">
         <input class="cmt_in" maxlength="300" placeholder="Ваше замечание… (антимат)">
         <button class="cmt_send" type="submit">➤</button>
       </form>
       <a class="cmt_gh" href="${REPO}/issues/new?title=${encodeURIComponent('Замечание по ')}${encodeURIComponent(b.file)}" target="_blank" rel="noopener noreferrer">Оставить постоянный комментарий на GitHub →</a>
     </div>
   </div>`).join('');

  grid.querySelectorAll('.card').forEach(card=>{
    const file=card.dataset.file;
    renderCmtList(file,card.querySelector('.cmt_list'));
    card.querySelector('.try').addEventListener('click',()=>openPrev(file));
    card.querySelector('.cmt_form').addEventListener('submit',e=>{
      e.preventDefault();
      addCmt(file,card.querySelector('.cmt_in').value,card.querySelector('.cmt_form'));
    });
  });
}

function openPrev(file){
  const b=BUILDS.find(x=>x.file===file);
  ovName.textContent=file;
  ovLink.href=file;
  cv.removeAttribute('sandbox');
  cv.setAttribute('sandbox', b&&b.st==='ok' ? 'allow-scripts allow-forms allow-same-origin allow-modals'
                                            : 'allow-scripts allow-forms');
  cv.src=file;
  ov.classList.add('on');
}
document.getElementById('close').addEventListener('click',()=>{ov.classList.remove('on');cv.src='about:blank'});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('close').click()});
initProf();
render();
})();
