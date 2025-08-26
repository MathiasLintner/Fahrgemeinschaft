var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const dataPath = path.join(dataDir, 'fahrten.json');

function readFahrten() {
  if (!fs.existsSync(dataPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    console.error('Fehler beim Lesen:', e);
    return [];
  }
}

function writeFahrten(list) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(list, null, 2), 'utf8');
}

// GET: Formular Fahrt anlegen
router.get('/anlegen', (req, res) => {
  res.render('anlegen', { title: 'Fahrt anlegen', fahrten: [] });
});

// POST: Fahrt speichern
router.post('/anlegen', (req, res) => {
  const { start, ziel, plaetze } = req.body;

  // Simple Validierung wie bei einem Anfängerprojekt
  if (!start || !ziel || !plaetze) {
    return res.status(400).send('Bitte Start, Ziel und Plätze ausfüllen.');
  }

  const fahrten = readFahrten();
  fahrten.push({
    start: String(start),
    ziel: String(ziel),
    plaetze: Number(plaetze)
  });
  writeFahrten(fahrten);

  res.redirect('/');
});

// GET: Formular Fahrt abfragen
router.get('/abfragen', (req, res) => {
  res.render('abfragen', { title: 'Fahrt abfragen', fahrten: [] });
});

// POST: Abfrage nach Ziel, Ergebnis wieder mit index.ejs anzeigen
router.post('/abfragen', (req, res) => {
  const ziel = (req.body.ziel || '').trim();
  const alle = readFahrten();
  const ergebnisse = ziel ? alle.filter(f => (f.ziel || '').trim() === ziel) : [];
  res.render('index', { title: 'Suchergebnisse', fahrten: ergebnisse });
});

module.exports = router;
