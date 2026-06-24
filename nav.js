const toggle=document.querySelector('.nav-toggle');
const links=document.querySelector('.nav-links');
function setOpen(open){ if(!toggle||!links) return; links.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('nav-open', open); }
toggle?.addEventListener('click',()=>setOpen(!links?.classList.contains('open')));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') setOpen(false); });
document.addEventListener('click',e=>{ if(!e.target.closest('.nav')) setOpen(false); });
links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
