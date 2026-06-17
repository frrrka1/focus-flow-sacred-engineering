const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('field-canvas');
const ctx = canvas?.getContext('2d');
let w = 0;
let h = 0;
let particles = [];

function resizeField(){
  if(!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = Math.floor(window.innerWidth * ratio);
  h = canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  const count = window.innerWidth < 700 ? 52 : 88;
  particles = Array.from({length: count}, (_, i) => ({
    phase: Math.random() * Math.PI * 2,
    speed: .000026 + Math.random() * .00004,
    offset: (Math.random() - .5) * 38 * ratio,
    size: (.7 + Math.random() * 1.35) * ratio,
    alpha: .14 + Math.random() * .34,
    gold: i % 12 === 0
  }));
}

function spiralPoint(t, scale){
  const r = 10 + t * scale;
  return {
    x: Math.cos(t) * r,
    y: Math.sin(t) * r
  };
}

function drawField(time = 0){
  if(!canvas || !ctx || !motionOK) return;
  ctx.clearRect(0, 0, w, h);

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const isMobile = window.innerWidth < 900;
  const centerX = w * (isMobile ? .5 : .72);
  const centerY = h * (isMobile ? .36 : .5);
  const scale = Math.min(w * (isMobile ? .0075 : .0085), 12 * ratio);

  ctx.globalCompositeOperation = 'lighter';

  particles.forEach((p, i) => {
    const t = (p.phase + time * p.speed) % (Math.PI * 10.5);
    const point = spiralPoint(t, scale);
    const drift = Math.sin(time * .00016 + i) * p.offset;

    const x = centerX + point.x + drift;
    const y = centerY + point.y + Math.cos(time * .00016 + i * .7) * p.offset * .4;

    const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 7);
    if(p.gold){
      g.addColorStop(0, `rgba(255,240,190,${p.alpha})`);
      g.addColorStop(1, 'rgba(208,176,90,0)');
    }else{
      g.addColorStop(0, `rgba(126,219,255,${p.alpha})`);
      g.addColorStop(1, 'rgba(104,91,255,0)');
    }

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, p.size * 6, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawField);
}

resizeField();
window.addEventListener('resize', resizeField);
if(motionOK) requestAnimationFrame(drawField);

const wordEl = document.querySelector('[data-words]');
if(wordEl && motionOK){
  const words = wordEl.dataset.words.split(',').map(word => word.trim()).filter(Boolean);
  let index = 0;

  window.setInterval(() => {
    wordEl.classList.add('is-changing');
    window.setTimeout(() => {
      index = (index + 1) % words.length;
      wordEl.textContent = words[index];
      wordEl.classList.remove('is-changing');
    }, 390);
  }, 2350);
}

const menuBtn = document.querySelector('[data-menu]');
const menuPanel = document.querySelector('[data-menu-panel]');

if(menuBtn && menuPanel){
  const closeMenu = () => {
    menuPanel.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuPanel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  menuPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if(!menuPanel.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
  });
}
