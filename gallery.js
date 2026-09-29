(function(){
const REPO='https://github.com/vany201847dody-art/windowsweb-builds';
const BUILDS=[
{file:'vssesuperbild.html', st:'ok', badge:'✅ итоговая', name:'Windows 11',
   note:'Финальная рабочая ОС: Пуск, панель задач, Проводник, «Этот компьютер», Банк, QR, Диктофон, Заметки, 5 игр, мировые часы. Хостится на отдельном сайте.'},
  {file:'grok.html', st:'ok', badge:'🟢 от Grok', name:'AetherOS',
   note:'Прислана Grok/xAI. 24 приложения: Диспетчер задач, Погода, Paint, Камера, Магазин, Браузер с вкладками, Банк, QR, Диктофон, Музыка, Терминал, 5 игр. Окна с ресайзом по всем точкам.'},
  {file:'DEEPSEEK.html', st:'wip', badge:'🟡 рабочий', name:'NovaOS 1.0 (DeepSeek)',
   note:'Отсюда портированы Банк/QR/Диктофон/Заметки/Игры/Мировые часы. Сама по себе сырая: эмодзи вместо иконок, нет доработок оболочки, поиск и Пуск местами не доделаны.'},
  {file:'deepseek.html', st:'bad', badge:'🔴 неудачная', name:'GoodWin 11 (DeepSeek)',
   note:'Более старая версия той же ветки: окна съезжают, панель задач и часть приложений не работают, много мусорного кода. Оставлена для истории.'},
  {file:'алиса аи.html', st:'bad', badge:'🔴 неудачная', name:'NovaOS v1.0 (Алиса АИ)',
   note:'Другая архитектура: системные окна почти не работают, Пуск и рабочий стол не собраны. Сохранена как источник идей.'},
  {file:'gigschat.html', st:'bad', badge:'🔴 неудачная', name:'NovaOS (Gigachat)',
   note:'Только базовые окна, оболочки нет: Пуск, панель задач и рабочий стол не реализованы. Мелкая заготовка для проверки.'},
  {file:'novaos.html', st:'ok', badge:'✅ NovaOS', name:'NovaOS v1.0',
   note:'Собственная сборка Vizor (© Vizor 2026), минифицированная версия ветки DeepSeek. Лежала в загрузках как index.html/index-1.html.'},
  {file:'novashell.html', st:'ok', badge:'🟢 линукс', name:'NovaShell — Vizor', linux:true,
   note:'Свой линукс-шелл (© Vizor): верхняя панель, окна, градиентные обои на тему Linux.'}
];

const grid=document.getElementById('grid');
const ov=document.getElementById('ov');
const cv=document.getElementById('cv');
const ovName=document.getElementById('ovName');
const ovLink=document.getElementById('ovLink');

function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function cardHTML(b,$i){
  return `<div class="card" data-file="${esc(b.file)}">
   <div class="top"><span class="badge b-${b.st}">${b.badge}</span></div>
   <div class="fname">${esc(b.file)}</div>
   <div class="stats">${esc(b.name)}</div>
   <div class="note">${b.note}</div>
   <div class="btns">
     <button class="try">🖱️ Потыкать</button>
     <a class="code" href="${REPO}/blob/main/${encodeURIComponent(b.file)}" target="_blank" rel="noopener noreferrer">Код</a>
   </div></div>`;
}

function render(){
  const secs=[['Windows 11',BUILDS.filter(b=>!b.linux)],['Linux',BUILDS.filter(b=>b.linux)]].filter(s=>s[1].length);
  const all=secs.reduce((a,s)=>a.concat(s[1]),[]);
  grid.innerHTML=secs.map(s=>'<div class="sec"><h2>'+s[0]+'</h2><div class="cg">'+s[1].map(cardHTML).join('')+'</div></div>').join('');
  grid.querySelectorAll('.card .try').forEach((btn,ci)=>{
    btn.addEventListener('click',()=>openPrev(all[ci].file));
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