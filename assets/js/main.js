/* RAJ HOMES — lightweight UI interactions, no dependencies */
// Paste your Google Apps Script Web App URL here after deployment.
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxIRcm2K5HC-9OgpcuhLGhp287_4So0o9tp0z9R19uRwpd0yFS7yEFNEooD3jMAn4Q_/exec';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  setTimeout(() => document.body.classList.add('loaded'), 450);

  const nav = $('.nav'), menu = $('.menu'), backTop = $('.back-top');
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  $$('nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  window.addEventListener('scroll', () => { nav.classList.toggle('stuck', scrollY > 40); backTop.classList.toggle('show', scrollY > 600); }, { passive: true });

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .14 });
  $$('.reveal').forEach(card => reveal.observe(card));
  const counters = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    const el = entry.target, end = Number(el.dataset.count), decimal = el.dataset.decimal;
    let start = 0; const timer = setInterval(() => { start += end / 42; if (start >= end) { el.textContent = decimal ? end.toFixed(1) : end + '+'; clearInterval(timer); } else el.textContent = decimal ? start.toFixed(1) : Math.floor(start); }, 28);
    el.dataset.done = 'true'; counters.unobserve(el);
  }), { threshold: .7 });
  $$('[data-count]').forEach(counter => counters.observe(counter));

  $('#emi-form').addEventListener('submit', event => {
    event.preventDefault(); const p = Number($('#loan').value), annual = Number($('#rate').value), months = Number($('#tenure').value) * 12, r = annual / 1200;
    const emi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    $('#emi-result').innerHTML = `${new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(emi)} <small>estimated monthly EMI</small>`;
  });

  $('#search-form').addEventListener('submit', event => { event.preventDefault(); document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' }); });
  
  $('#lead-form').addEventListener('submit', async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const note = $('#form-note');
  const submit = $('button[type="submit"]', form);

  if (GOOGLE_SHEETS_WEB_APP_URL.includes('PASTE_YOUR')) {
    note.textContent =
      'Google Sheets is not connected yet. Add your Web App URL in assets/js/main.js.';
    return;
  }

  submit.disabled = true;
  note.textContent = 'Sending your request…';

  const payload = new URLSearchParams(new FormData(form));
  payload.append('source', 'Investors Banyan website');

  try {
    await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: payload
    });

    note.textContent = 'Thank you — an advisor will contact you shortly.';
    form.reset();
  } catch (error) {
    note.textContent = 'We could not send your request. Please call us directly.';
  } finally {
    submit.disabled = false;
  }
});

  $$('.filter-buttons button').forEach(button => button.addEventListener('click', () => { $$('.filter-buttons button').forEach(item => item.classList.remove('active')); button.classList.add('active'); const type = button.dataset.filter; $$('.gallery-item').forEach(item => item.hidden = type !== 'all' && !item.classList.contains(type)); }));
  const lightbox = $('.lightbox'); $$('.gallery-item').forEach(item => item.addEventListener('click', () => { $('img', lightbox).src = $('img', item).src; $('img', lightbox).alt = $('img', item).alt; $('p', lightbox).textContent = item.dataset.caption; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); }));
  const closeLightbox = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); }; $('.lightbox button').addEventListener('click', closeLightbox); lightbox.addEventListener('click', event => event.target === lightbox && closeLightbox()); document.addEventListener('keydown', event => event.key === 'Escape' && closeLightbox());
  const quotes = [
    ['“RAJ HOMES understood what we wanted before we did. They didn’t just find us an apartment—they found our family’s next chapter.”', 'Aditi & Karan Malhotra', 'AK'],
    ['“The process felt transparent, calm and genuinely tailored to us. That made all the difference.”', 'Sonal Bhatia', 'SB'],
    ['“Their local knowledge helped us make a decision we feel even better about today.”', 'Rohit Mehra', 'RM']
  ]; let quoteIndex = 0;
  const rotateQuote = direction => { quoteIndex = (quoteIndex + direction + quotes.length) % quotes.length; const [quote, name, initials] = quotes[quoteIndex]; $('blockquote').textContent = quote; $('.client > span').textContent = initials; $('.client b').textContent = name; $('.testimonial-controls span').textContent = `0${quoteIndex + 1} / 03`; };
  $('#prev-quote').addEventListener('click', () => rotateQuote(-1)); $('#next-quote').addEventListener('click', () => rotateQuote(1));
});
