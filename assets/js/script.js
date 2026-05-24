/* ─── Sticky Nav ─── */
const topbar = document.querySelector('.masthead-topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── Scroll Spy ─── */
const navLinks = document.querySelectorAll('.masthead-nav a');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
const sections = ['masthead-hero','features','trends','photo-essay','food','essay'].map(id => document.getElementById(id));
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if(sec && window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  [...navLinks, ...mobileNavLinks].forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ─── Mobile Nav ─── */
function toggleMobileNav(){
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  const open = nav.classList.toggle('open');
  btn.classList.toggle('active', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobileNav(){
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  nav.classList.remove('open');
  btn.classList.remove('active');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─── Modals ─── */
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow='';
}
function closeOnBg(e,el){
  if(e.target===el) closeModal(el.id);
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    document.querySelectorAll('.modal-overlay.open').forEach(o=>{
      o.classList.remove('open');
    });
    closeMobileNav();
    document.body.style.overflow='';
  }
});

/* ─── B&A Tabs ─── */
function switchTab(idx){
  document.querySelectorAll('.ba-tab').forEach((t,i)=>t.classList.toggle('active',i===idx));
  document.querySelectorAll('.ba-panel').forEach((p,i)=>p.classList.toggle('active',i===idx));
}

/* ─── Before/After Slider ─── */
function initSlider(id, divId, handId){
  const el = document.getElementById(id);
  const divider = document.getElementById(divId);
  const handle = document.getElementById(handId);
  const afterImg = el.querySelector('.ba-after-img');
  if(!el) return;
  let dragging = false;
  function setPos(x){
    const rect = el.getBoundingClientRect();
    let pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left = pct + '%';
    handle.style.left = pct + '%';
  }
  el.addEventListener('mousedown', e=>{ dragging=true; setPos(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e=>{ if(dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', ()=>{ dragging=false; });
  el.addEventListener('touchstart', e=>{ dragging=true; setPos(e.touches[0].clientX); },{passive:true});
  window.addEventListener('touchmove', e=>{ if(dragging) setPos(e.touches[0].clientX); },{passive:true});
  window.addEventListener('touchend', ()=>{ dragging=false; });
}
initSlider('slider0','div0','hand0');
initSlider('slider1','div1','hand1');
initSlider('slider2','div2','hand2');

/* ─── HIGHLIGHT TOOLBAR ─── */
const toolbar = document.getElementById('highlightToolbar');
let activeColor = 'hl-gold';

// Show toolbar on text selection
document.addEventListener('selectionchange', () => {
  const sel = window.getSelection();
  if (sel && sel.toString().trim().length > 0 && !sel.isCollapsed) {
    toolbar.classList.add('visible');
  } else {
    // Small delay so button clicks register before hiding
    setTimeout(() => {
      const sel2 = window.getSelection();
      if (!sel2 || sel2.toString().trim().length === 0) {
        toolbar.classList.remove('visible');
      }
    }, 200);
  }
});

function applyHighlight(colorClass) {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

  try {
    const range = sel.getRangeAt(0);
    const selectedText = sel.toString().trim();
    if (!selectedText) return;

    // Wrap selection in <mark>
    const mark = document.createElement('mark');
    mark.className = colorClass;
    mark.setAttribute('data-highlight', 'true');

    // Only wrap if not crossing block boundaries awkwardly
    const commonAncestor = range.commonAncestorContainer;
    const isTextNode = commonAncestor.nodeType === Node.TEXT_NODE;
    const parentTag = isTextNode ? commonAncestor.parentElement.tagName : commonAncestor.tagName;

    // Avoid wrapping across block elements
    const blockTags = ['DIV','SECTION','ARTICLE','HEADER','FOOTER','NAV','H1','H2','H3'];
    if (!blockTags.includes(parentTag)) {
      range.surroundContents(mark);
    } else {
      // Fallback: wrap individual text nodes
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }

    sel.removeAllRanges();
    toolbar.classList.remove('visible');
  } catch(e) {
    // Selection crosses complex DOM — just clear
    sel.removeAllRanges();
    toolbar.classList.remove('visible');
  }
}

function clearHighlights() {
  document.querySelectorAll('mark[data-highlight]').forEach(mark => {
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });
  toolbar.classList.remove('visible');
}

/* ─── Entrance animations ─── */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.transition='opacity .6s ease, transform .6s ease';
      entry.target.style.opacity='1';
      entry.target.style.transform='translateY(0)';
      io.unobserve(entry.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.trend-card,.food-item,.feat-card,.ba-stats').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(20px)';
  io.observe(el);
});