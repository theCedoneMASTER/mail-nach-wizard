// ── THEME ───────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.querySelector('.theme-icon').textContent =
    document.body.classList.contains('light') ? '☀️' : '🌙';
});

// ── RIPPLE ──────────────────────────────────────────────────
function ripple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const r = document.createElement('span');
  r.className = 'ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

// ── TAB SWITCHER ────────────────────────────────────────────
let currentTab = 'preview';
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    renderOutput();
  });
});

// ── UPDATE COUNT ─────────────────────────────────────────────
function updateCounts() {
  const total = document.querySelectorAll('.baustein:checked').length;
  document.getElementById('activeCount').textContent = total;

  [0, 1, 2].forEach(i => {
    const n = document.querySelectorAll(`.baustein[data-cat="${i}"]:checked`).length;
    const el = document.getElementById(`count-${i}`);
    if (el) el.textContent = n;
  });
}

// ── RENDER OUTPUT ────────────────────────────────────────────
function renderOutput() {
  const bausteine = [...document.querySelectorAll('.baustein')].filter(cb => cb.checked);
  const finalDiv  = document.getElementById('finalText');

  if (currentTab === 'html') {
    const raw = buildHTML(bausteine).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    finalDiv.innerHTML = `<pre style="font-size:12px;line-height:1.6;color:var(--text2);white-space:pre-wrap;word-break:break-all">${raw}</pre>`;
    return;
  }

  finalDiv.innerHTML = buildHTML(bausteine);
  finalDiv.style.animation = 'none';
  void finalDiv.offsetWidth;
  finalDiv.style.animation = '';
}

function buildHTML(bausteine) {
  let html = `<p>Hallo Zusammen,</p>
<p>Ich danke für das Gespräch. Wie besprochen erstelle ich noch eine Mail mit dem weiteren Vorgehen.</p>`;

  if (bausteine.length > 0) {
    html += `<p>Informationen die wir noch benötigen:</p><ul>`;
    bausteine.forEach(cb => html += `<li>${cb.getAttribute('data-title')}</li>`);
    html += `</ul>`;
  }

  bausteine.forEach(cb => html += cb.getAttribute('data-html') + '<br>');

  html += `<p>Damit wir einen weiteren Termin planen können, müssen die Informationen bereitgestellt werden. Sie können diese entweder selbst bereitstellen oder direkt die Einrichtung vornehmen. Bei Fragen stehe ich Ihnen selbstverständlich jederzeit zur Verfügung.</p>`;
  return html;
}

// ── COPY ─────────────────────────────────────────────────────
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', ripple);
copyBtn.addEventListener('click', async function () {
  const bausteine = [...document.querySelectorAll('.baustein')].filter(cb => cb.checked);
  const html = buildHTML(bausteine);
  const text = new DOMParser().parseFromString(html, 'text/html').body.innerText;

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html':  new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' })
      })
    ]);
    this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Kopiert!`;
    this.classList.add('copied');
    setTimeout(() => {
      this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Kopieren`;
      this.classList.remove('copied');
    }, 2200);
  } catch {
    this.textContent = 'Fehler!';
    setTimeout(() => { this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Kopieren`; }, 2000);
  }
});

// ── INIT ─────────────────────────────────────────────────────
document.querySelectorAll('.baustein').forEach(cb => {
  cb.addEventListener('change', () => { updateCounts(); renderOutput(); });
});

updateCounts();
renderOutput();
