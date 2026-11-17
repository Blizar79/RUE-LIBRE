/* RUE-LIBRÉ — script.js */
(function () {
  'use strict';

  /* ---------- Data ---------- */
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const PRODUCTS = [
    { id: 'w1', cat: 'women', name: 'Oversized Wool Coat', price: 489, tag: 'New', tone: '#5a1623', desc: 'A long, relaxed coat in dense wool blend with dropped shoulders and a clean, hidden placket.' },
    { id: 'w2', cat: 'women', name: 'Tailored Wide Trousers', price: 215, tone: '#1b1b1b', desc: 'High-waisted trousers with a fluid wide leg and sharp pressed crease.' },
    { id: 'w3', cat: 'women', name: 'Heavy Cotton Hoodie', price: 175, tag: 'New', tone: '#cfc6b4', desc: 'Boxy 480 gsm brushed cotton hoodie with a double-layer hood and tonal embroidery.' },
    { id: 'w4', cat: 'women', name: 'Satin Slip Dress', price: 260, tone: '#3a0f18', desc: 'Bias-cut midi dress in matte satin with fine straps and a quiet drape.' },
    { id: 'm1', cat: 'men', name: 'Structured Bomber', price: 345, tag: 'New', tone: '#151515', desc: 'Matte technical bomber with a clean collar, concealed pockets and a soft lining.' },
    { id: 'm2', cat: 'men', name: 'Boxy Heavy Tee', price: 95, tone: '#e3dccd', desc: 'Oversized tee in 260 gsm combed cotton with a ribbed collar and small chest mark.' },
    { id: 'm3', cat: 'men', name: 'Pleated Cargo Pants', price: 225, tone: '#2b2723', desc: 'Relaxed cargo pants with a pleated front, adjustable hem and utility pockets.' },
    { id: 'm4', cat: 'men', name: 'Wool Overshirt', price: 235, tag: 'New', tone: '#4a1420', desc: 'A felted wool overshirt in deep bordeaux, cut straight with a hidden snap closure.' }
  ];
  const COLLECTIONS = [
    { id: 'c1', title: 'Liberté', sub: 'AW 2026', tone: '#5a1623', link: '#/women' },
    { id: 'c2', title: 'Noir Atelier', sub: 'Essentials', tone: '#141414', link: '#/men' },
    { id: 'c3', title: 'Crème', sub: 'SS 2026', tone: '#d6cdbb', link: '#/women' }
  ];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => '€' + n.toLocaleString('en-US');

  /* ---------- Images (local files, tonal fallback if missing) ---------- */
  function fallback(label, tone) {
    const light = /^#(c|d|e)/i.test(tone);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><rect width="600" height="800" fill="${tone}"/><text x="300" y="410" text-anchor="middle" font-family="Georgia,serif" font-size="26" letter-spacing="8" fill="${light ? '#0b0b0b' : '#f4efe6'}" opacity=".55">${label.toUpperCase().slice(0, 22)}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  function img(src, alt, tone, lazy = true) {
    const i = document.createElement('img');
    i.alt = alt; i.decoding = 'async';
    if (lazy) i.loading = 'lazy';
    i.onerror = function () { this.onerror = null; this.src = fallback(alt, tone); };
    i.src = src;
    return i;
  }
  function setImg(id, src, alt, tone) { const el = $('#' + id); el.replaceWith(Object.assign(img(src, alt, tone, false), { id })); }

  /* ---------- Rendering ---------- */
  function card(p) {
    const a = document.createElement('a');
    a.className = 'card reveal'; a.href = '#/product/' + p.id;
    a.innerHTML = '<div class="img-wrap">' + (p.tag ? '<span class="tag">' + p.tag + '</span>' : '') + '</div><div class="card-info"><span>' + p.name + '</span><span>' + fmt(p.price) + '</span></div>';
    $('.img-wrap', a).append(img(`images/${p.id}-1.jpg`, p.name, p.tone), img(`images/${p.id}-2.jpg`, p.name + ' — detail', shade(p.tone)));
    return a;
  }
  function shade(hex) { return hex === '#cfc6b4' || hex === '#e3dccd' ? '#bdb29c' : '#2a2a2a'; }
  function fillGrid(sel, list) { const g = $(sel); g.replaceChildren(...list.map(card)); }
  function tiles(sel, list) {
    $(sel).replaceChildren(...list.map(c => {
      const a = document.createElement('a'); a.className = 'tile reveal'; a.href = c.link;
      a.innerHTML = '<div><small>' + c.sub + '</small><h3>' + c.title + '</h3></div>';
      a.prepend(img(`images/${c.id}.jpg`, c.title, c.tone));
      return a;
    }));
  }
  function renderProduct(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) { location.hash = '#/home'; return; }
    let size = null;
    const box = $('#productDetail');
    box.innerHTML = `<div class="pd"><div class="pd-gallery"></div><div class="pd-info">
      <p class="crumbs"><a href="#/home">Home</a> / <a href="#/${p.cat}">${p.cat}</a></p>
      <h1>${p.name}</h1><p class="price">${fmt(p.price)}</p><p>${p.desc}</p>
      <p class="crumbs">Select size</p><div class="sizes">${SIZES.map(s => `<button class="size" data-s="${s}">${s}</button>`).join('')}</div>
      <p class="size-msg" id="sizeMsg"></p>
      <button class="btn btn-fill btn-full" id="addBtn">Add to Bag</button>
      <div class="details">Composition: premium cotton / wool blend<br>Made in Portugal · Free returns within 30 days<br>Ref. RL-${p.id.toUpperCase()}</div></div></div>`;
    const gal = $('.pd-gallery', box);
    [1, 2].forEach(n => { const w = document.createElement('div'); w.className = 'img-wrap reveal'; w.append(img(`images/${p.id}-${n}.jpg`, p.name + (n === 2 ? ' — detail' : ''), n === 1 ? p.tone : shade(p.tone), false)); gal.append(w); });
    $$('.size', box).forEach(b => b.onclick = () => { size = b.dataset.s; $$('.size', box).forEach(x => x.classList.toggle('sel', x === b)); $('#sizeMsg').textContent = ''; });
    $('#addBtn').onclick = () => {
      if (!size) { $('#sizeMsg').textContent = 'Please select a size.'; return; }
      addToCart(p.id, size); toast(p.name + ' (' + size + ') added to your bag');
    };
    fillGrid('#relatedProducts', PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4));
    document.title = p.name + ' — RUE-LIBRÉ';
  }

  /* ---------- Cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('rl-cart')) || []; } catch (e) { cart = []; }
  cart = cart.filter(i => PRODUCTS.some(p => p.id === i.id) && SIZES.includes(i.size) && i.qty > 0);
  const save = () => { try { localStorage.setItem('rl-cart', JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } };
  function addToCart(id, size) {
    const f = cart.find(i => i.id === id && i.size === size);
    f ? f.qty = Math.min(f.qty + 1, 10) : cart.push({ id, size, qty: 1 });
    save(); renderCart(); const b = $('#bagBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  function renderCart() {
    const body = $('#cartItems');
    let total = 0, count = 0;
    if (!cart.length) body.innerHTML = '<p class="empty">Your bag is empty.</p>';
    else {
      body.replaceChildren(...cart.map((it, idx) => {
        const p = PRODUCTS.find(x => x.id === it.id);
        total += p.price * it.qty; count += it.qty;
        const el = document.createElement('div'); el.className = 'item';
        el.innerHTML = `<div class="img-wrap"></div><div><h4>${p.name}</h4><p class="meta">Size ${it.size} · ${fmt(p.price)}</p>
          <div class="item-row"><div class="qty"><button data-a="dec" aria-label="Decrease quantity">−</button><span>${it.qty}</span><button data-a="inc" aria-label="Increase quantity">+</button></div><strong>${fmt(p.price * it.qty)}</strong></div>
          <button class="remove" data-a="rm">Remove</button></div>`;
        $('.img-wrap', el).append(img(`images/${p.id}-1.jpg`, p.name, p.tone));
        el.onclick = e => {
          const a = e.target.dataset.a; if (!a) return;
          if (a === 'inc') it.qty = Math.min(it.qty + 1, 10);
          if (a === 'dec') it.qty--;
          if (a === 'rm' || it.qty < 1) cart.splice(idx, 1);
          save(); renderCart();
        };
        return el;
      }));
    }
    $('#cartTotal').textContent = fmt(total);
    $('#bagCount').textContent = count;
  }
  function openCart(open) {
    $('#drawer').classList.toggle('open', open);
    $('#drawer').setAttribute('aria-hidden', !open);
    $('#overlay').classList.toggle('show', open);
    document.body.classList.toggle('no-scroll', open);
  }
  $('#bagBtn').onclick = () => openCart(true);
  $('#closeBag').onclick = $('#overlay').onclick = () => openCart(false);
  $('#checkoutBtn').onclick = () => toast(cart.length ? 'Demo shop — checkout is not enabled.' : 'Your bag is empty.');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { openCart(false); menu(false); } });

  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600); }

  /* ---------- Mobile menu ---------- */
  function menu(open) {
    $('#nav').classList.toggle('open', open); $('#burger').classList.toggle('open', open);
    $('#burger').setAttribute('aria-expanded', open); $('#header').classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
  }
  $('#burger').onclick = () => menu(!$('#nav').classList.contains('open'));

  /* ---------- Scroll reveal ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  function observe() {
    $$('.reveal:not(.in)').forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
      io ? io.observe(el) : el.classList.add('in');
    });
  }

  /* ---------- Router ---------- */
  const TITLES = { home: 'RUE-LIBRÉ — Luxury Streetwear', women: 'Women — RUE-LIBRÉ', men: 'Men — RUE-LIBRÉ', collections: 'Collections — RUE-LIBRÉ', about: 'About — RUE-LIBRÉ' };
  function route() {
    const [, page = 'home', arg] = location.hash.split('/');
    const name = ['home', 'women', 'men', 'collections', 'about', 'product'].includes(page) ? page : 'home';
    if (name === 'product') renderProduct(arg); else document.title = TITLES[name];
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    $$('[data-link]').forEach(a => a.classList.toggle('active', a.dataset.link === (name === 'product' ? (PRODUCTS.find(p => p.id === arg) || {}).cat : name)));
    $('#header').classList.toggle('solid', name !== 'home' || scrollY > 40);
    window.scrollTo({ top: 0, behavior: 'auto' });
    menu(false); openCart(false);
    requestAnimationFrame(observe);
  }
  window.addEventListener('hashchange', route);

  /* ---------- Header behavior ---------- */
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = scrollY, home = $('#view-home').classList.contains('active');
    $('#header').classList.toggle('solid', !home || y > 40);
    $('#header').classList.toggle('hide', y > lastY && y > 400 && !document.body.classList.contains('no-scroll'));
    lastY = y;
  }, { passive: true });
  $('#toTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ---------- Init ---------- */
  setImg('heroImg', 'images/hero.jpg', 'RUE-LIBRÉ AW26', '#2a1a1d');
  setImg('edImg', 'images/editorial.jpg', 'Editorial', '#cfc6b4');
  setImg('aboutImg', 'images/about.jpg', 'Atelier', '#1b1b1b');
  tiles('#homeTiles', COLLECTIONS); tiles('#collectionTiles', COLLECTIONS);
  fillGrid('#homeProducts', PRODUCTS.filter(p => p.tag).slice(0, 4));
  fillGrid('#gridWomen', PRODUCTS.filter(p => p.cat === 'women'));
  fillGrid('#gridMen', PRODUCTS.filter(p => p.cat === 'men'));
  $('#year').textContent = new Date().getFullYear();
  renderCart(); route();

  window.addEventListener('load', () => {
    setTimeout(() => {
      $('#loader').classList.add('done');
      document.body.classList.remove('is-loading'); document.body.classList.add('ready');
      setTimeout(() => $('#loader').remove(), 1300);
    }, 1400);
  });
})();
