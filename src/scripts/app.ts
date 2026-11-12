// Moves the site between its states without reloading: home, work, a project, about, contact.
// The pages are already built in the right state; this script takes over from there.
import { carousel, pad2 } from '../lib/layout';

type View = 'home' | 'work' | 'project' | 'about' | 'contact';
type Scr = 'top' | 'mid' | 'end';
interface State {
  view: View;
  idx: number;
}
interface Data {
  name: string;
  hello: string;
  lines: string[];
  titles: Record<string, string>;
  projects: { slug: string; short: string; title: string }[];
}

const root = document.documentElement;
// The "nothing here" page keeps plain links.
if (!root.hasAttribute('data-static')) boot();

function boot() {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

  const data: Data = JSON.parse($('#app-data').textContent || '{}');
  const P = data.projects;
  const N = P.length;
  const mod = (i: number) => ((i % N) + N) % N;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const dock = $('[data-dock]');
  const ball = $<HTMLAnchorElement>('[data-ball]');
  const eyes = $('[data-eyes]');
  const segs = $$('[data-seg]');
  const sayText = $('[data-say-text]');
  const far = $('[data-far]');
  const farHeading = $('[data-far-heading]');
  const cards = $$<HTMLAnchorElement>('[data-card]');
  const home = $('[data-home]');
  const main = $('#main');
  const contact = $('[data-contact]');
  const announcer = $('[data-announce]');
  const navLinks = $$<HTMLAnchorElement>('[data-nav]');
  const openProject = $<HTMLAnchorElement>('[data-open-project]');
  const allWork = $<HTMLAnchorElement>('[data-all]');
  const nextProject = $<HTMLAnchorElement>('[data-next-project]');
  const shortEl = $('[data-short]');
  const nextShortEl = $('[data-next-short]');
  const countEls = $$('[data-count]');

  let cur: State = { view: (root.dataset.view as View) || 'home', idx: Number(root.dataset.idx) || 0 };
  let intro: 'dot' | 'hello' | null = (root.dataset.intro as 'dot') || null;
  let saying = false;
  let scr: Scr = 'top';
  let lineNo = 0;
  let introTimers: number[] = [];
  let sayTimer = 0;
  let swallowClick = false;

  // ── Addresses ──────────────────────────────────────────────────────────────

  const slugIdx = (slug: string) => P.findIndex((p) => p.slug === slug);

  function parse(loc: { pathname: string; hash: string }): State | null {
    const parts = loc.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return { view: 'home', idx: cur.idx };
    if (parts.length === 1 && (parts[0] === 'about' || parts[0] === 'contact')) return { view: parts[0] as View, idx: cur.idx };
    if (parts[0] === 'work') {
      if (parts.length === 1) {
        const i = slugIdx(decodeURIComponent(loc.hash.slice(1)));
        return { view: 'work', idx: i >= 0 ? i : cur.idx };
      }
      if (parts.length === 2) {
        const i = slugIdx(decodeURIComponent(parts[1]));
        return i >= 0 ? { view: 'project', idx: i } : null;
      }
    }
    return null;
  }

  function urlFor(s: State): string {
    if (s.view === 'home') return '/';
    if (s.view === 'work') return s.idx ? `/work/#${P[s.idx].slug}` : '/work/';
    if (s.view === 'project') return `/work/${P[s.idx].slug}/`;
    return `/${s.view}/`;
  }

  const titleFor = (s: State) => (s.view === 'project' ? `${P[s.idx].title} — ${data.name}` : data.titles[s.view]);

  // ── Drawing a state ────────────────────────────────────────────────────────

  // About and the project pages wait inside <template> until first opened.
  function mount(key: string) {
    const tpl = document.querySelector<HTMLTemplateElement>(`template[data-tpl="${key}"]`);
    if (!tpl) return;
    const videos = Array.from(tpl.content.querySelectorAll('video'));
    tpl.replaceWith(tpl.content);
    // A video that waited inside a <template> has to be told to look for its file again.
    videos.forEach((v) => v.load());
    watchVideos(main);
  }

  function render(next: State) {
    cur = next;
    const { view, idx } = next;
    root.dataset.view = view;
    root.dataset.idx = String(idx);
    root.removeAttribute('data-peek');
    if (view !== 'home') {
      endIntro();
      stopSay();
    }

    // Cards
    cards.forEach((el, i) => {
      const c = carousel(i, idx, N);
      el.style.setProperty('--cx', String(c.cx));
      el.style.setProperty('--cs', String(c.cs));
      el.style.setProperty('--cb', `${c.cb}px`);
      el.style.setProperty('--co', String(c.co));
      el.style.setProperty('--cz', String(c.cz));
      el.dataset.d = String(c.d);
      el.inert = view === 'work' && Math.abs(c.d) >= 2;
      const video = el.querySelector('video');
      if (video) {
        if (view === 'work' && c.d === 0 && !reduce.matches) video.play().catch(() => {});
        else video.pause();
      }
    });

    // Layers
    far.inert = !(view === 'home' || view === 'work') || !!intro;
    farHeading.setAttribute('aria-level', view === 'work' ? '1' : '2');
    home.inert = view !== 'home';
    contact.inert = view !== 'contact';

    // Pages
    const sheet = view === 'about' ? 'about' : view === 'project' ? `project:${P[idx].slug}` : '';
    if (sheet) mount(sheet);
    $$('[data-sheet]').forEach((el) => {
      el.hidden = el.dataset.sheet !== sheet;
    });

    // Capsule
    const p = P[idx];
    const nx = P[mod(idx + 1)];
    const count = `${pad2(idx + 1)} / ${pad2(N)}`;
    countEls.forEach((el) => (el.textContent = count));
    shortEl.textContent = p.short;
    openProject.href = `/work/${p.slug}/`;
    allWork.href = urlFor({ view: 'work', idx });
    nextProject.href = `/work/${nx.slug}/`;
    nextShortEl.textContent = nx.short;
    navLinks.forEach((a) => {
      if (a.dataset.nav === view) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    scr = 'top';
    root.dataset.scr = scr;
    document.title = titleFor(next);
    syncDock();
    if (view === 'project') requestAnimationFrame(readScroll);
  }

  // Which group of controls the capsule shows, and how wide it needs to be.
  function syncDock() {
    const open =
      intro === 'dot'
        ? ''
        : saying || intro === 'hello'
          ? 'hello'
          : cur.view === 'work'
            ? 'pager'
            : cur.view === 'project'
              ? scr === 'mid'
                ? 'count'
                : 'proj'
              : 'menu';
    segs.forEach((seg) => {
      const on = seg.dataset.seg === open;
      seg.toggleAttribute('data-open', on);
      seg.inert = !on;
      if (on) seg.style.setProperty('--w', `${seg.scrollWidth}px`);
    });
    root.toggleAttribute('data-say', open === 'hello');
  }

  function announce(text: string) {
    announcer.textContent = '';
    requestAnimationFrame(() => (announcer.textContent = text));
  }

  // ── Moving between states ──────────────────────────────────────────────────

  function go(next: State, replace = false) {
    if (next.view === cur.view && next.idx === cur.idx) return;
    const hadFocus = document.activeElement;
    if (replace) {
      history.replaceState({ ...next }, '', urlFor(next));
    } else {
      history.replaceState({ ...cur, y: window.scrollY }, '');
      history.pushState({ ...next }, '', urlFor(next));
    }
    const samePage = replace && next.view === cur.view;
    render(next);
    if (!samePage) {
      window.scrollTo(0, 0);
      announce(titleFor(next));
      // If what was focused is gone (a card behind a page), start reading from the page.
      if ((next.view === 'project' || next.view === 'about') && hadFocus && hadFocus.closest('[inert]')) {
        main.focus({ preventScroll: true });
      }
    }
  }

  const step = (dir: number) => go({ view: cur.view, idx: mod(cur.idx + dir) }, cur.view === 'work');

  // ── The companion ──────────────────────────────────────────────────────────

  function startIntro() {
    intro = 'dot';
    far.inert = true;
    syncDock();
    introTimers = [
      window.setTimeout(() => {
        if (intro !== 'dot') return;
        intro = 'hello';
        root.dataset.intro = 'hello';
        sayText.textContent = data.hello;
        syncDock();
        announce(data.hello);
      }, 1300),
      window.setTimeout(endIntro, 3300),
    ];
  }

  function endIntro() {
    if (!intro) return;
    intro = null;
    introTimers.forEach(clearTimeout);
    root.removeAttribute('data-intro');
    far.inert = !(cur.view === 'home' || cur.view === 'work');
    try {
      sessionStorage.setItem('seen', '1');
    } catch {}
    syncDock();
  }

  function say(text = data.lines[lineNo++ % Math.max(1, data.lines.length)] || data.hello) {
    clearTimeout(sayTimer);
    sayText.textContent = text;
    saying = true;
    syncDock();
    announce(text);
    sayTimer = window.setTimeout(stopSay, 1500 + text.length * 40);
  }

  function stopSay() {
    if (!saying) return;
    saying = false;
    clearTimeout(sayTimer);
    syncDock();
  }

  function onBall() {
    if (intro === 'dot') {
      intro = 'hello';
      root.dataset.intro = 'hello';
      sayText.textContent = data.hello;
      syncDock();
    } else if (intro === 'hello') endIntro();
    else if (cur.view !== 'home') go({ view: 'home', idx: cur.idx });
    else if (saying) stopSay();
    else say();
  }

  // ── Clicks ─────────────────────────────────────────────────────────────────

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (swallowClick) {
      swallowClick = false;
      e.preventDefault();
      return;
    }
    const a = target.closest<HTMLAnchorElement>('a[href]');

    if (!a) {
      // A click on the empty space around the contact panel closes it.
      if (cur.view === 'contact' && !target.closest('[data-contact], [data-dock]')) go({ view: 'home', idx: cur.idx });
      return;
    }
    if (a.target === '_blank' || a.hasAttribute('download') || a.origin !== location.origin) return;

    if (a === ball) {
      e.preventDefault();
      onBall();
      return;
    }
    if (a.hasAttribute('data-card')) {
      e.preventDefault();
      const i = Number(a.dataset.i);
      if (cur.view !== 'work') go({ view: 'work', idx: i });
      else if (i === cur.idx) go({ view: 'project', idx: i });
      else go({ view: 'work', idx: i }, true);
      return;
    }
    const next = parse(a);
    if (!next) return;
    e.preventDefault();
    // Pressing Contact again puts the panel away.
    if (next.view === 'contact' && cur.view === 'contact') go({ view: 'home', idx: cur.idx });
    else go(next);
  });

  $('[data-prev]').addEventListener('click', () => step(-1));
  $('[data-next]').addEventListener('click', () => step(1));

  // Hovering (or tabbing to) "Work" on the home screen makes the cards lean in.
  const workLink = navLinks.find((a) => a.dataset.nav === 'work');
  const peek = (on: boolean) => root.toggleAttribute('data-peek', on && cur.view === 'home' && !intro);
  workLink?.addEventListener('pointerenter', () => peek(true));
  workLink?.addEventListener('pointerleave', () => peek(false));
  workLink?.addEventListener('focus', () => peek(true));
  workLink?.addEventListener('blur', () => peek(false));

  // ── Keyboard ───────────────────────────────────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (cur.view === 'work' || cur.view === 'project') {
        e.preventDefault();
        step(e.key === 'ArrowRight' ? 1 : -1);
      }
    } else if (e.key === 'Escape') {
      if (intro) endIntro();
      else if (saying) stopSay();
      else if (cur.view === 'project') go({ view: 'work', idx: cur.idx });
      else if (cur.view !== 'home') go({ view: 'home', idx: cur.idx });
    } else if (e.key === 'Enter' && cur.view === 'work' && document.activeElement === document.body) {
      go({ view: 'project', idx: cur.idx });
    }
  });

  // ── Swipe between cards on Work ────────────────────────────────────────────

  let swipe: { x: number; y: number; id: number } | null = null;
  window.addEventListener('pointerdown', (e) => {
    if (cur.view !== 'work' || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (e.target instanceof Element && e.target.closest('[data-dock]')) return;
    swipe = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  window.addEventListener('pointerup', (e) => {
    if (!swipe || swipe.id !== e.pointerId) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    swipe = null;
    if (cur.view !== 'work' || Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    step(dx < 0 ? 1 : -1);
    // A mouse drag ends with a click on whatever is under the pointer; ignore that one.
    if (e.pointerType === 'mouse') {
      swallowClick = true;
      window.setTimeout(() => (swallowClick = false), 80);
    }
  });
  window.addEventListener('pointercancel', () => (swipe = null));

  // ── Scrolling a project: the capsule shrinks to a counter, then offers the next one ──

  let scrollQueued = false;
  function readScroll() {
    scrollQueued = false;
    if (cur.view !== 'project') return;
    const rest = root.scrollHeight - window.scrollY - window.innerHeight;
    const now: Scr = rest < 140 ? 'end' : window.scrollY < 60 ? 'top' : 'mid';
    if (now === scr) return;
    scr = now;
    root.dataset.scr = now;
    syncDock();
  }
  function queueScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(readScroll);
  }
  window.addEventListener('scroll', queueScroll, { passive: true });

  // ── The eyes follow the pointer; the cards drift a little against it ───────

  let px = 0;
  let py = 0;
  let moveQueued = false;
  function look() {
    moveQueued = false;
    const rc = ball.getBoundingClientRect();
    const dx = px - (rc.left + rc.width / 2);
    const dy = py - (rc.top + rc.height / 2);
    const dist = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, dist / 160);
    eyes.style.transform = `translate(${((dx / dist) * 4.5 * k).toFixed(1)}px, ${((dy / dist) * 3.5 * k).toFixed(1)}px)`;
    far.style.setProperty('--px', `${(-(px / window.innerWidth - 0.5) * 26).toFixed(1)}px`);
    far.style.setProperty('--py', `${(-(py / window.innerHeight - 0.5) * 18).toFixed(1)}px`);
  }
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' || reduce.matches) return;
      px = e.clientX;
      py = e.clientY;
      if (moveQueued) return;
      moveQueued = true;
      requestAnimationFrame(look);
    },
    { passive: true },
  );

  // ── Video loops play only while on screen ──────────────────────────────────

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((en) => {
              const v = en.target as HTMLVideoElement;
              if (en.isIntersecting && !reduce.matches) v.play().catch(() => {});
              else v.pause();
            }),
          { threshold: 0.25 },
        )
      : null;
  function watchVideos(scope: ParentNode) {
    scope.querySelectorAll<HTMLVideoElement>('video[data-loop]').forEach((v) => {
      if (reduce.matches) v.controls = true;
      io?.observe(v);
    });
  }

  // ── Back / Forward ─────────────────────────────────────────────────────────

  window.addEventListener('popstate', (e) => {
    const st = e.state as (State & { y?: number }) | null;
    const next = st && st.view ? { view: st.view, idx: st.idx } : parse(location);
    if (!next) {
      location.reload();
      return;
    }
    render(next);
    announce(titleFor(next));
    const y = st?.y ?? 0;
    requestAnimationFrame(() => window.scrollTo(0, y));
  });

  window.addEventListener('resize', () => {
    syncDock();
    queueScroll();
  });

  // ── Start ──────────────────────────────────────────────────────────────────

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const first = parse(location) || cur;
  history.replaceState({ ...first }, '');
  watchVideos(document);
  render(first);
  if (intro) startIntro();
  else if (first.view === 'home') {
    try {
      sessionStorage.setItem('seen', '1');
    } catch {}
  }
  document.fonts?.ready.then(syncDock);
  // Two frames later everything is in place and may start animating.
  requestAnimationFrame(() => requestAnimationFrame(() => root.setAttribute('data-ready', '')));
}
