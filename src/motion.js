export function mountHollowmere() {
  let alive = true;
  let raf = 0;
  let splitTimer = 0;
  const cleanups = [];
  const timers = [];
  function on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    cleanups.push(function () { target.removeEventListener(type, fn, opts); });
  }
  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
  }
  function stop() {
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(splitTimer);
    timers.forEach(clearTimeout);
    cleanups.forEach(function (fn) { fn(); });
    if (typeof document.getAnimations === 'function') {
      document.getAnimations().forEach(function (a) { a.cancel(); });
    }
  }

  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const scroller = document.getElementById('scroller');
  const hero = document.getElementById('top');
  const heroArt = hero.querySelector('.art');
  const heroCopy = hero.querySelector('.hero-copy');
  const title = hero.querySelector('h1');
  const sub = hero.querySelector('.sub');
  const lamp = document.querySelector('.lamp');
  const falls = [...document.querySelectorAll('canvas.fall')];
  const dusts = [...document.querySelectorAll('canvas.dust')];

  let cur = window.scrollY;
  let last = performance.now();
  const t0 = last;
  let mx = innerWidth * 0.5, my = innerHeight * 0.4, moved = false;
  let lx = mx, ly = my;

  function mod(n, m) { return ((n % m) + m) % m; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function pageHeight() {
    let h = 0;
    for (const child of scroller.children) h += child.offsetHeight;
    return h;
  }
  function layout() {
    document.body.style.height = pageHeight() + 'px';
  }

  function anchorY(el) {
    let y = 0;
    let n = el;
    while (n && n !== scroller) {
      y += n.offsetTop;
      n = n.offsetParent;
    }
    return y;
  }

  on(document, 'click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo(0, anchorY(el));
    history.pushState(null, '', '#' + id);
  });

  function splitElement(el) {
    const text = el.dataset.text || el.textContent.trim();
    el.dataset.text = text;
    const words = text.split(/\s+/);
    el.textContent = '';
    const nodes = [];
    words.forEach(function (word, i) {
      const s = document.createElement('span');
      s.textContent = word;
      el.appendChild(s);
      nodes.push(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    const lines = [];
    let buf = [];
    let top = null;
    nodes.forEach(function (s) {
      const y = s.offsetTop;
      if (top === null || Math.abs(y - top) <= 2) {
        buf.push(s.textContent);
        top = y;
      } else {
        lines.push(buf.join(' '));
        buf = [s.textContent];
        top = y;
      }
    });
    if (buf.length) lines.push(buf.join(' '));
    el.replaceChildren();
    lines.forEach(function (line) {
      const ln = document.createElement('span');
      ln.className = 'ln';
      const inner = document.createElement('span');
      inner.textContent = line;
      ln.appendChild(inner);
      el.appendChild(ln);
    });
  }

  function showStatic(copy) {
    copy.querySelectorAll('.ln > span').forEach(function (s) { s.style.transform = 'none'; });
    const rule = copy.querySelector('.rule');
    if (rule) rule.style.transform = 'scaleX(1)';
  }

  function splitAll() {
    document.querySelectorAll('.copy').forEach(function (copy) {
      copy.querySelectorAll('h2, h3, p').forEach(splitElement);
      copy.classList.add('ready');
      if (copy.dataset.revealed === '1' || reduce) {
        showStatic(copy);
        copy.dataset.revealed = '1';
      }
    });
  }

  function reveal(copy) {
    if (copy.dataset.revealed === '1') return;
    copy.dataset.revealed = '1';
    if (reduce) { showStatic(copy); return; }
    copy.querySelectorAll('.ln > span').forEach(function (span, i) {
      span.animate(
        [{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }],
        { duration: 1000, delay: i * 80, easing: EASE, fill: 'forwards' }
      );
    });
    const rule = copy.querySelector('.rule');
    if (rule) {
      rule.animate(
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: 1100, delay: 160, easing: EASE, fill: 'forwards' }
      );
    }
  }

  function checkReveals() {
    document.querySelectorAll('.copy.ready').forEach(function (copy) {
      if (copy.dataset.revealed === '1') return;
      if (copy.getBoundingClientRect().top < innerHeight * 0.8) reveal(copy);
    });
  }

  if (!reduce) {
    title.querySelectorAll('.ch > span').forEach(function (el, i) {
      el.animate(
        [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }],
        { duration: 1200, delay: 250 + i * 70, easing: EASE, fill: 'forwards' }
      );
    });
    const mobile = matchMedia('(max-width: 767px)').matches;
    sub.animate([
      { letterSpacing: '1.4em', transform: 'translateX(-50%) translateY(14px)', clipPath: 'inset(0 50% 0 50%)' },
      { letterSpacing: mobile ? '.42em' : '.62em', transform: 'translateX(-50%) translateY(0px)', clipPath: 'inset(0px)' }
    ], { duration: 1600, delay: 900, easing: EASE, fill: 'forwards' });
    heroArt.animate(
      [{ '--zoom': 1.09 }, { '--zoom': 1 }],
      { duration: 2600, easing: EASE, fill: 'forwards' }
    );
    document.querySelector('.nav').animate(
      [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }],
      { duration: 900, delay: 500, easing: EASE, fill: 'forwards' }
    );
    later(function () {
      if (!alive) return;
      title.querySelectorAll('.ch').forEach(function (ch) { ch.style.overflow = 'visible'; });
    }, 250 + 9 * 70 + 1200);
  }

  function bootCopy() {
    if (!alive) return;
    splitAll();
    checkReveals();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(bootCopy);
  else bootCopy();

  on(window, 'resize', function () {
    clearTimeout(splitTimer);
    splitTimer = setTimeout(function () { splitAll(); checkReveals(); }, 160);
  });

  function makeGradientSprite(stops) {
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 160;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 160);
    stops.forEach(function (s) { grad.addColorStop(s[0], s[1]); });
    g.fillStyle = grad;
    g.fillRect(0, 0, 8, 160);
    return c;
  }
  const ghostA = makeGradientSprite([[0, 'rgba(190,240,255,0)'], [0.35, 'rgba(210,248,255,.95)'], [1, 'rgba(120,200,255,0)']]);
  const ghostB = makeGradientSprite([[0, 'rgba(120,190,255,0)'], [0.5, 'rgba(140,215,255,.8)'], [1, 'rgba(90,150,255,0)']]);
  const lavaA = makeGradientSprite([[0, 'rgba(255,190,80,0)'], [0.4, 'rgba(255,236,150,1)'], [1, 'rgba(255,120,30,0)']]);
  const lavaB = makeGradientSprite([[0, 'rgba(255,120,30,0)'], [0.5, 'rgba(255,150,50,.9)'], [1, 'rgba(255,80,20,0)']]);

  function fitCanvas(c) {
    const w = c.offsetWidth;
    const h = c.offsetHeight;
    if (!w || !h) return false;
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    if (c._cssW === w && c._cssH === h && c._dpr === dpr && c.width === bw) return false;
    c.width = bw;
    c.height = bh;
    c._cssW = w;
    c._cssH = h;
    c._dpr = dpr;
    return true;
  }

  function buildStreaks(c) {
    const w = c._cssW;
    const h = c._cssH;
    const lava = c.dataset.kind === 'lava';
    const n = lava ? Math.round(w / 3) * 3 : Math.round(w / 2.2) * 2;
    const A = lava ? lavaA : ghostA;
    const B = lava ? lavaB : ghostB;
    const streaks = [];
    for (let i = 0; i < n; i++) {
      streaks.push({
        x: lava ? w * rand(0.25, 0.75) : Math.random() * w,
        sw: lava ? rand(1, 3.2) : rand(0.8, 4),
        len: lava ? rand(30, 100) : rand(60, 280),
        v: lava ? rand(195, 350) : rand(420, 760),
        alpha: rand(0.18, 0.73),
        phase: Math.random() * (h + 400),
        sprite: Math.random() < 0.45 ? A : B
      });
    }
    c._streaks = streaks;
    c._grad = null;
  }

  function makeParticles(c) {
    const n = +c.dataset.n;
    const kind = c.dataset.kind;
    const parts = [];
    for (let i = 0; i < n; i++) {
      const p = {
        u: Math.random(),
        v: Math.random(),
        r: 1,
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.4, 1.2),
        rnd: Math.random(),
        len: rand(12, 32),
        alpha: rand(0.25, 0.75)
      };
      if (kind === 'wisp') {
        p.u = rand(0.2, 0.8);
        p.v = rand(0.35, 0.98);
        p.r = rand(0.8, 2.6);
      } else if (kind === 'mote') {
        p.r = rand(0.6, 2);
      } else if (kind === 'spray') {
        p.r = rand(0.7, 2.3);
        p.phase = Math.random();
      } else if (kind === 'bubble') {
        p.r = rand(2, 9);
        p.phase = Math.random();
      }
      parts.push(p);
    }
    c._parts = parts;
  }

  function nearView(el) {
    const r = el.getBoundingClientRect();
    return r.bottom > -50 && r.top < innerHeight + 50 && r.right > -50 && r.left < innerWidth + 50;
  }

  function drawFall(c, t) {
    const w = c._cssW, h = c._cssH;
    if (!w || !h || !c._streaks) return;
    const ctx = c.getContext('2d');
    const dpr = c._dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (c.dataset.water) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      if (!c._grad) {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, 'rgba(80,150,255,0)');
        g.addColorStop(0.18, 'rgba(90,175,255,.7)');
        g.addColorStop(0.5, 'rgba(175,238,255,.96)');
        g.addColorStop(0.82, 'rgba(90,175,255,.7)');
        g.addColorStop(1, 'rgba(80,150,255,0)');
        c._grad = g;
      }
      ctx.fillStyle = c._grad;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'lighter';
    const speed = parseFloat(c.dataset.speed || '1');
    const ghost = c.dataset.kind !== 'lava';
    for (let i = 0; i < c._streaks.length; i++) {
      const s = c._streaks[i];
      const span = h + s.len;
      const y = mod(t * s.v * speed + s.phase, span) - s.len;
      let a = s.alpha;
      if (ghost) {
        const e = Math.abs(s.x / w - 0.5) * 2;
        a *= 1 - e * e * 0.6;
      }
      ctx.globalAlpha = a;
      ctx.drawImage(s.sprite, s.x - s.sw / 2, y, s.sw, s.len);
      ctx.drawImage(s.sprite, s.x - s.sw / 2, y - span, s.sw, s.len);
    }
    ctx.globalAlpha = 1;
  }

  function drawDust(c, t, dt, live) {
    const W = c._cssW, H = c._cssH;
    if (!W || !H || !c._parts) return;
    const ctx = c.getContext('2d');
    ctx.setTransform(c._dpr, 0, 0, c._dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    const kind = c.dataset.kind;
    const boxed = c.dataset.x != null;
    const bx = boxed ? +c.dataset.x / 100 * W : 0;
    const by = boxed ? +c.dataset.y / 100 * H : 0;
    const bw = boxed ? +c.dataset.w / 100 * W : W;
    const bh = boxed ? +c.dataset.h / 100 * H : H;
    const parts = c._parts;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (kind === 'wisp') {
        if (live) {
          p.v -= 0.02 * p.speed * dt;
          if (p.v < 0.35) {
            p.v = 0.98;
            p.u = rand(0.2, 0.8);
          }
        }
        const traveled = (0.98 - p.v) / (0.98 - 0.35);
        const fade = Math.min(1, Math.max(0, traveled / 0.25));
        const alpha = fade * Math.abs(Math.sin(2 * t + p.phase));
        const x = p.u * W + Math.sin(t + p.phase) * 0.012 * W;
        const y = p.v * H;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgb(190,240,255)';
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'mote') {
        if (live) {
          p.v -= 0.008 * p.speed * dt;
          if (p.v < 0) p.v += 1;
        }
        const x = p.u * W + Math.sin(t * 0.8 + p.phase) * 0.02 * W;
        const y = p.v * H;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = 'rgb(170,225,255)';
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'spray') {
        const life = mod(t * p.speed * 0.8 + p.phase, 1);
        const x = bx + p.u * bw + (p.rnd - 0.5) * 0.6 * bw * life;
        const y = by + p.v * bh + life * life * 0.9 * bh;
        ctx.globalAlpha = 1 - life;
        ctx.fillStyle = 'rgb(200,245,255)';
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'bubble') {
        const life = mod(t * p.speed * 0.16 + p.phase, 1);
        const x = bx + p.u * bw + Math.sin(1.4 * t + p.phase) * 0.03 * bw;
        const y = by + bh - life * bh;
        const rad = p.r * (W / 1440);
        const a = Math.sin(life * Math.PI) * 0.9;
        const g = ctx.createRadialGradient(x - rad * 0.28, y - rad * 0.34, rad * 0.08, x, y, Math.max(rad, 0.5));
        g.addColorStop(0, 'rgba(255,240,180,' + a + ')');
        g.addColorStop(0.55, 'rgba(255,170,70,' + (0.55 * a) + ')');
        g.addColorStop(1, 'rgba(255,170,70,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'shimmer') {
        const a = Math.max(0, Math.sin(t * (1.2 + 2 * p.rnd) + p.phase)) * 0.8;
        const spread = 0.3 + 0.7 * p.v;
        const x = bx + bw * 0.5 + (p.u - 0.5) * bw * spread - p.len * 0.5;
        const y = by + p.v * bh;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255,240,205,' + a + ')';
        ctx.fillRect(x, y, p.len, 1.2);
      }
    }
    ctx.globalAlpha = 1;
  }

  function refitAll() {
    falls.forEach(function (c) {
      if (fitCanvas(c) || !c._streaks) buildStreaks(c);
    });
    dusts.forEach(function (c) {
      fitCanvas(c);
      if (!c._parts) makeParticles(c);
    });
  }

  document.querySelectorAll('.art').forEach(function (art) {
    const y0 = parseFloat(art.dataset.batTop);
    const y1 = parseFloat(art.dataset.batBot);
    art.querySelectorAll('.bat').forEach(function (el) {
      el._y = rand(y0, y1);
      el._amp = rand(1, 4);
      el._dur = rand(9, 16);
      el._off = Math.random() * el._dur;
      el._hz = rand(8, 12);
      el.style.width = rand(1.6, 3.2) + '%';
    });
    art.querySelectorAll('.ghost').forEach(function (el) {
      el._phase = Math.random() * Math.PI * 2;
      el._px = 0;
      el._py = 0;
    });
  });

  function placeSprites(t, dt, live) {
    document.querySelectorAll('.art').forEach(function (art) {
      const artW = art.offsetWidth;
      const artH = art.offsetHeight;
      if (!artW || !artH) return;
      const rect = art.getBoundingClientRect();
      const sx = rect.width / artW || 1;
      const sy = rect.height / artH || 1;
      art.querySelectorAll('.ghost').forEach(function (el) {
        const ax = (+el.dataset.x / 100) * artW;
        const ay = (+el.dataset.y / 100) * artH;
        const ph = el._phase;
        const baseX = ax + Math.sin(0.35 * t + ph) * artW * 0.012;
        const baseY = ay + Math.sin(0.9 * t + ph) * artH * 0.014;
        let tx = 0, ty = 0;
        if (live && fine && moved) {
          const gsx = rect.left + ((baseX + el._px) / artW) * rect.width;
          const gsy = rect.top + ((baseY + el._py) / artH) * rect.height;
          const dx = gsx - mx;
          const dy = gsy - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 260 && dist > 0.001) {
            const mag = Math.pow(1 - dist / 260, 1.5) * 90;
            tx = (dx / dist) * mag / sx;
            ty = (dy / dist) * mag / sy;
          }
        }
        if (live) {
          const k = 1 - Math.exp(-3 * dt);
          el._px += (tx - el._px) * k;
          el._py += (ty - el._py) * k;
        }
        const x = baseX + el._px;
        const y = baseY + el._py;
        const rot = Math.sin(0.7 * t + ph) * 6 + (x - ax) * 0.05;
        el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%) rotate(' + rot + 'deg)';
      });
      art.querySelectorAll('.bat').forEach(function (el) {
        const p = mod(t + el._off, el._dur) / el._dur;
        const x = ((-8 + p * 116) / 100) * artW;
        const y = (el._y / 100) * artH + Math.sin(p * 9 + el._off * 6) * (el._amp / 100) * artH;
        if (live) el.classList.toggle('down', Math.floor(t * el._hz) % 2 === 1);
        el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
      });
    });
  }

  function applyParallax() {
    const h = hero.offsetHeight || 1;
    const hp = Math.max(0, Math.min(1, cur / h));
    title.style.setProperty('--lsx', (hp * 0.18) + 'em');
    heroArt.style.setProperty('--py', (cur * 0.32) + 'px');
    heroCopy.style.setProperty('--cy', (cur * 0.55) + 'px');
  }

  function paint(t, dt, live) {
    falls.forEach(function (c) { if (nearView(c)) drawFall(c, t); });
    dusts.forEach(function (c) { if (nearView(c)) drawDust(c, t, dt, live); });
    placeSprites(live ? t : 0, dt, live);
    if (fine && moved && live) {
      const k = 1 - Math.exp(-10 * dt);
      lx += (mx - lx) * k;
      ly += (my - ly) * k;
      lamp.style.transform = 'translate3d(' + lx + 'px,' + ly + 'px,0) translate(-50%,-50%)';
    }
  }

  on(window, 'pointermove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!moved) {
      moved = true;
      lx = mx;
      ly = my;
      lamp.classList.add('on');
    }
  }, { passive: true });

  layout();
  refitAll();
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      window.scrollTo(0, anchorY(el));
      cur = window.scrollY;
    }
  }

  if (reduce) {
    function applyReduced() {
      cur = window.scrollY;
      scroller.style.transform = 'translate3d(0,' + (-cur) + 'px,0)';
      applyParallax();
    }
    applyReduced();
    paint(0, 0, false);
    on(window, 'scroll', applyReduced, { passive: true });
    on(window, 'resize', function () {
      layout();
      refitAll();
      paint(0, 0, false);
      applyReduced();
    });
    return stop;
  }

  function frame(now) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const target = window.scrollY;
    cur += (target - cur) * (1 - Math.exp(-7.5 * dt));
    if (Math.abs(target - cur) < 0.05) cur = target;
    scroller.style.transform = 'translate3d(0,' + (-cur) + 'px,0)';
    applyParallax();
    checkReveals();
    const t = (now - t0) / 1000;
    refitAll();
    paint(t, dt, true);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  on(window, 'resize', function () {
    layout();
    refitAll();
  });
  return stop;
}
