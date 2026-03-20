// ── THEME TOGGLE ───────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.querySelector('.theme-icon').textContent =
    document.body.classList.contains('light') ? '☀️' : '🌙';
});

// ── RIPPLE ─────────────────────────────────────────────────
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const r = document.createElement('span');
  r.className = 'ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

// ── UPDATE TEXT ─────────────────────────────────────────────
function updateText() {
  const bausteine = document.querySelectorAll('.baustein');
  const active = [...bausteine].filter(cb => cb.checked);
  const finalDiv = document.getElementById('finalText');

  let html = `<p>Hallo Zusammen,</p>
<p>Ich danke für das Gespräch. Wie besprochen erstelle ich noch eine Mail mit dem weiteren Vorgehen.</p>`;

  if (active.length > 0) {
    html += `<p>Informationen die wir noch benötigen:</p><ul>`;
    active.forEach(cb => html += `<li>${cb.getAttribute('data-title')}</li>`);
    html += `</ul>`;
  }

  active.forEach(cb => html += cb.getAttribute('data-html') + '<br>');

  html += `<p>Damit wir einen weiteren Termin planen können, müssen die Informationen bereitgestellt werden. Sie können diese entweder selbst bereitstellen oder direkt die Einrichtung vornehmen. Bei Fragen stehe ich Ihnen selbstverständlich jederzeit zur Verfügung.</p>`;

  finalDiv.innerHTML = html;
}

// ── COPY ────────────────────────────────────────────────────
document.getElementById('copyBtn').addEventListener('click', addRipple);
document.getElementById('copyBtn').addEventListener('click', async function () {
  const btn = this;
  const html = document.getElementById('finalText').innerHTML;
  const text = document.getElementById('finalText').innerText;
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html':  new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' })
      })
    ]);
    btn.textContent = '✓ Kopiert!';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = '📋 Kopieren'; btn.classList.remove('copied'); }, 2000);
  } catch {
    btn.textContent = 'Fehler!';
    setTimeout(() => { btn.innerHTML = '📋 Kopieren'; }, 2000);
  }
});

// ── INIT ────────────────────────────────────────────────────
document.querySelectorAll('.baustein').forEach(cb => cb.addEventListener('change', updateText));
updateText();
