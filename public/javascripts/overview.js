async function loadFahrten() {
const info = document.getElementById('ajaxInfo');
const tbody = document.getElementById('fahrten-body-ssr');
info.textContent = 'Lade per AJAX…';
try {
const res = await fetch('/fahrten/uebersicht?format=json', { headers: { 'Accept': 'application/json' } });
const data = await res.json();
const rows = (data.fahrten || []).map((f, idx) => `
<tr>
<td>${idx + 1}</td>
<td>${f.start}</td>
<td>${f.ziel}</td>
<td>${f.plaetze}</td>
</tr>`).join('');
if (tbody) tbody.innerHTML = rows || '<tr><td colspan="4">Keine Fahrten vorhanden.</td></tr>';
info.textContent = 'Aktualisiert.';
} catch (e) {
info.textContent = 'Fehler beim Laden :(';
console.error(e);
}
}


document.addEventListener('DOMContentLoaded', () => {
const btn = document.getElementById('reloadBtn');
if (btn) btn.addEventListener('click', loadFahrten);
});
