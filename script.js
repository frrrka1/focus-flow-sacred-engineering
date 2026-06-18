const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuBtn = document.querySelector('[data-menu]');
const menuPanel = document.querySelector('[data-menu-panel]');
if (menuBtn && menuPanel) {
  menuBtn.addEventListener('click', () => {
    const open = menuPanel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuPanel.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

if (!reduceMotion) {
  document.querySelectorAll('[data-words]').forEach((wordEl) => {
    const words = wordEl.dataset.words.split(',').map((word) => word.trim()).filter(Boolean);
    let index = 0;
    window.setInterval(() => {
      wordEl.classList.add('is-changing');
      window.setTimeout(() => {
        index = (index + 1) % words.length;
        wordEl.textContent = words[index];
        wordEl.classList.remove('is-changing');
      }, 420);
    }, 2600);
  });

  document.querySelectorAll('.concept-demo').forEach((demo) => {
    demo.addEventListener('pointermove', (event) => {
      const rect = demo.getBoundingClientRect();
      const mx = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
      const my = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
      demo.style.setProperty('--mx', mx);
      demo.style.setProperty('--my', my);
    });
    demo.addEventListener('pointerleave', () => {
      demo.style.setProperty('--mx', 0);
      demo.style.setProperty('--my', 0);
    });
  });
}

const statusEl = document.querySelector('[data-selected-status]');
document.querySelectorAll('[data-choose]').forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.choose;
    document.querySelectorAll('.direction').forEach((section) => {
      section.classList.toggle('is-selected', section.dataset.direction === choice);
    });
    if (statusEl) statusEl.textContent = `${choice} selected locally. Scroll and compare once more.`;
  });
});
