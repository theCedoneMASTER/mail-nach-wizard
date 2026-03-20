// ── DARK/LIGHT SWITCH ─────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '☀️ Light' : '🌙 Dark';
});

// ── RIPPLE EFFECT ──────────────────────────────────────────
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// ── UPDATE FINAL TEXT ──────────────────────────────────────
function updateText() {
  let output = "<p>Hallo Zusammen,</p><p>Ich danke für das Gespräch. Wie besprochen erstelle ich noch eine Mail mit dem weiteren Vorgehen.</p>";

  const bausteine = document.querySelectorAll('.baustein');
  const titles = [];
  bausteine.forEach(cb => { if (cb.checked) titles.push(cb.getAttribute('data-title')); });

  if (titles.length > 0) {
    output += "Informationen die wir noch benötigen:\n<ul>";
    titles.forEach(t => output += `<li>${t}</li>`);
    output += "</ul>\n";
  }

  bausteine.forEach(cb => {
    if (cb.checked) output += cb.getAttribute('data-html') + "<br><br>";
  });

  output += "Damit wir einen weiteren Termin planen können, müssen die Informationen bereitgestellt werden. Sie können diese entweder selbst bereitstellen oder direkt die Einrichtung vornehmen. Bei Fragen stehe ich Ihnen selbstverständlich jederzeit zur Verfügung.";

  const finalDiv = document.getElementById('finalText');
  finalDiv.innerHTML = output + "<button id='copyBtn'>Kopieren</button>";

  // Copy button
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', addRipple);
  copyBtn.addEventListener('click', async function () {
    const btn = this;
    const html = finalDiv.innerHTML.replace(/<button[^>]*>.*?<\/button>/s, '');
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([finalDiv.innerText], { type: 'text/plain' })
        })
      ]);
      btn.textContent = '✓ Kopiert!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Kopieren';
        btn.classList.remove('copied');
      }, 2000);
    } catch {
      btn.textContent = 'Fehler!';
      setTimeout(() => { btn.textContent = 'Kopieren'; }, 2000);
    }
  });
}

// ── INIT ───────────────────────────────────────────────────
document.querySelectorAll('.baustein').forEach(cb => cb.addEventListener('change', updateText));
themeToggle.addEventListener('click', addRipple);
updateText();
