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

  const count = window.innerWidth < 700 ? 64 : 120;
  particles = Array.from({length: count}, (_, i) => ({
    phase: Math.random() * Math.PI * 2,
    speed: .000035 + Math.random() * .000055,
    offset: (Math.random() - .5) * 54 * ratio,
    size: (.7 + Math.random() * 1.6) * ratio,
    alpha: .18 + Math.random() * .5,
    gold: i % 11 === 0
  }));
}

function lemniscate(t, scale){
  const denom = 1 + Math.sin(t) * Math.sin(t);
  return {
    x: (Math.cos(t) / denom) * scale,
    y: (Math.sin(t) * Math.cos(t) / denom) * scale * .72
  };
}

function drawField(time = 0){
  if(!canvas || !ctx || !motionOK) return;
  ctx.clearRect(0, 0, w, h);

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const centerX = w * (window.innerWidth < 900 ? .66 : .69);
  const centerY = h * .46;
  const scale = Math.min(w * .33, 390 * ratio);

  ctx.globalCompositeOperation = 'lighter';

  particles.forEach((p, i) => {
    const t = p.phase + time * p.speed;
    const point = lemniscate(t, scale);
    const drift = Math.sin(time * .00025 + i) * p.offset;

    const x = centerX + point.x + drift;
    const y = centerY + point.y + Math.cos(time * .0002 + i * .7) * p.offset * .55;

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

    if(i % 4 === 0){
      const q = particles[(i + 9) % particles.length];
      const qt = q.phase + time * q.speed;
      const qPoint = lemniscate(qt, scale);
      const qx = centerX + qPoint.x;
      const qy = centerY + qPoint.y;
      const dist = Math.hypot(x - qx, y - qy);
      if(dist < 190 * ratio){
        ctx.strokeStyle = `rgba(126,219,255,${.035 * (1 - dist / (190 * ratio))})`;
        ctx.lineWidth = ratio;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(qx, qy);
        ctx.stroke();
      }
    }
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
    }, 430);
  }, 2400);
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
