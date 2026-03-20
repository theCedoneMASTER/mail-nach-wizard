// DARK/LIGHT SWITCH
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? "🌞 Light" : "🌙 Dark";
});

// UPDATE FINAL TEXT
function updateText() {
 

  let output = "<p>Hallo Zusammen,</p><p>Ich danke für das Gespräch. Wie besprochen erstelle ich noch eine Mail mit dem weiteren Vorgehen.</p>";

  const bausteine = document.querySelectorAll('.baustein');
  let titles = [];
  bausteine.forEach(cb => {
    if(cb.checked) titles.push(cb.getAttribute('data-title'));
  });

  if(titles.length > 0) {
    output += "Informationen die wir noch benötigen:\n<ul>";
    titles.forEach(t => output += "<li>" + t + "</li>");
    output += "</ul>\n";
  }

  bausteine.forEach(cb => {
    if(cb.checked) output += cb.getAttribute('data-html') + "<br><br>";
  });

  output += "Damit wir einen weiteren Termin planen können, müssen die Informationen bereitgestellt werden. Sie können diese entweder selbst bereitstellen oder direkt die Einrichtung vornehmen. Bei Fragen stehe ich Ihnen selbstverständlich jederzeit zur Verfügung.";

  const finalDiv = document.getElementById('finalText');
  finalDiv.innerHTML = output + "<button id='copyBtn'>Kopieren</button>";

  // COPY BUTTON
  document.getElementById('copyBtn').addEventListener('click', async function() {
    const html = finalDiv.innerHTML.replace(/<button[^>]*>.*?<\/button>/s, '');
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([finalDiv.innerText], { type: 'text/plain' })
        })
      ]);
      alert("Text wurde kopiert!");
    } catch (err) {
      alert("Kopieren fehlgeschlagen – bitte Rechtsklick → Kopieren benutzen.");
    }
  });
}

// initial call + add listeners
document.querySelectorAll('.baustein').forEach(cb => cb.addEventListener('change', updateText));
updateText();