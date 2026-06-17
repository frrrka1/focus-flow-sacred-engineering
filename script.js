const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wordEl = document.querySelector('[data-words]');
if (wordEl && !reduceMotion) {
  const words = wordEl.dataset.words.split(',').map((word) => word.trim()).filter(Boolean);
  let index = 0;

  setInterval(() => {
    wordEl.classList.add('is-changing');
    setTimeout(() => {
      index = (index + 1) % words.length;
      wordEl.textContent = words[index];
      wordEl.classList.remove('is-changing');
    }, 420);
  }, 2600);
}

const menuBtn = document.querySelector('[data-menu]');
const menuPanel = document.querySelector('[data-menu-panel]');

if (menuBtn && menuPanel) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menuPanel.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuPanel.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
