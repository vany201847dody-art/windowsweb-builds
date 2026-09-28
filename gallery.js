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

function getCmt(file){
  try{const v=JSON.parse(localStorage.getItem('cmt_'+file)||'[]');return Array.isArray(v)?v:[]}
  catch(e){return[]}
}
function saveCmt(file,arr){try{localStorage.setItem('cmt_'+file,JSON.stringify(arr.slice(-40)))}catch(e){}}

function renderCmtList(file,el){
  el.textContent='';
  const arr=getCmt(file);
  if(!arr.length){const d=document.createElement('div');d.className='cmt_empty';d.textContent='Комментариев пока нет';el.appendChild(d);return}
  for(let i=arr.length-1;i>=0;i--){
    const it=arr[i], row=document.createElement('div');
    row.className='cmt_it';
    const t=document.createElement('b');t.textContent=it.t||'';
    row.appendChild(t);
    row.appendChild(document.createTextNode(it.x||it.a||''));
    el.appendChild(row);
  }
}

function addCmt(file,raw,form){
  const a=mask(raw.trim()).slice(0,300);
  if(!a)return;
  const now=new Date();
  const ts=now.toLocaleDateString('ru')+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  const arr=getCmt(file);arr.push({t:ts,x:a});saveCmt(file,arr);
  const list=form.parentElement.querySelector('.cmt_list');
  renderCmtList(file,list);
  form.querySelector('.cmt_in').value='';
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
render();
})();
