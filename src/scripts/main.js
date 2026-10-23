// ════════════════════════════════════════════════════════════
//  GAIA — interactions (JavaScript natif, sans dépendance)
//  1. En-tête + parallaxe (une seule boucle rAF)
//  2. Menu mobile  3. Section active  4. Révélations au scroll
//  5. Inclinaison douce des cartes de l'équipe
// ════════════════════════════════════════════════════════════
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopQuery = window.matchMedia('(min-width: 900px)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ── 1. En-tête + parallaxe ───────────────────────────────── */
const header = $('[data-header]');
const heroBg = $('[data-parallax]');
const hero = $('[data-hero]');
let ticking = false;

function onFrame() {
  ticking = false;
  const y = window.scrollY;
  if (header) header.dataset.scrolled = y > 24 ? 'true' : 'false';

  // Parallaxe très douce : bureau uniquement, hero visible uniquement.
  if (heroBg && hero) {
    const active = desktopQuery.matches && !reducedQuery.matches && y < hero.offsetHeight;
    heroBg.style.setProperty('--py', active ? `${(y * 0.16).toFixed(1)}px` : '0px');
  }
}
function requestFrame() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onFrame);
  }
}
window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', requestFrame, { passive: true });
onFrame();

/* ── 2. Menu mobile ───────────────────────────────────────── */
const toggle = $('[data-menu-toggle]');
const nav = $('[data-nav]');

function setMenu(open, { returnFocus = false } = {}) {
  if (!toggle || !header) return;
  toggle.setAttribute('aria-expanded', String(open));
  header.dataset.open = String(open);
  if (!open && returnFocus) toggle.focus();
}
if (toggle && nav) {
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  // Fermer après le choix d'un lien
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  // Échap ferme le menu et rend le focus au bouton
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, { returnFocus: true });
  });
  // Clic en dehors
  document.addEventListener('click', (e) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(e.target)) setMenu(false);
  });
  // Retour en mode bureau
  window.matchMedia('(min-width: 860px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}

/* ── 3. Indicateur de section active ──────────────────────── */
const navLinks = $$('[data-nav-link]');
const linkById = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
if ('IntersectionObserver' in window && linkById.size) {
  let current = null;
  const setCurrent = (id) => {
    if (id === current) return;
    current = id;
    linkById.forEach((a, key) => (key === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  };
  const spy = new IntersectionObserver(
    (entries) => {
      entries.filter((e) => !e.isIntersecting && e.target.id === current).forEach(() => setCurrent(null));
      entries.filter((e) => e.isIntersecting).forEach((e) => setCurrent(linkById.has(e.target.id) ? e.target.id : null));
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  $$('main section[id]').forEach((s) => spy.observe(s));
}

/* ── 4. Révélations au scroll ─────────────────────────────── */
const revealEls = $$('[data-reveal]');
function finish(el) {
  // Une fois révélé, on rend l'élément à ses styles normaux (survols, inclinaison…)
  el.removeAttribute('data-reveal');
  el.classList.remove('is-visible');
  el.style.removeProperty('--d');
}
function show(el, delay = 0) {
  if (delay) el.style.setProperty('--d', `${delay}ms`);
  el.classList.add('is-visible');
  window.setTimeout(() => finish(el), delay + 2200);
}

if (reducedQuery.matches || !('IntersectionObserver' in window)) {
  revealEls.forEach(finish); // contenu visible immédiatement, aucune animation
} else {
  const groups = $$('[data-stagger]');
  const grouped = new Set(groups.flatMap((g) => $$('[data-reveal]', g)));
  const singles = revealEls.filter((el) => !grouped.has(el));

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el); // une seule fois : aucun effet répété
        if (el.hasAttribute('data-stagger')) {
          $$('[data-reveal]', el).forEach((child, i) => show(child, i * 110));
        } else {
          show(el);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0 }
  );
  singles.forEach((el) => io.observe(el));
  groups.forEach((g) => io.observe(g));
}

/* ── 5. Inclinaison douce des cartes de l'équipe ──────────── */
if (finePointer.matches && !reducedQuery.matches) {
  $$('[data-tilt]').forEach((card) => {
    let frame = 0;
    const MAX = 4; // degrés
    card.addEventListener('pointermove', (e) => {
      if (card.hasAttribute('data-reveal')) return; // attendre la fin de l'entrée
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--ry', `${(px * MAX * 2).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-py * MAX * 2).toFixed(2)}deg`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
