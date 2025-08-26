// myExpressApp/routes/index.js
var express = require('express');
var router = express.Router();
const Fahrt = require('../models/Fahrt');

// Standard: direkt zur Übersicht
router.get('/', (req, res) => res.redirect('/fahrten'));

// Fahrtenübersicht (GET)
router.get('/fahrten', async (req, res) => {
  try {
    const fahrten = await Fahrt.findAll({ order: [['createdAt','DESC']] });
    res.render('index', { title: 'Fahrtenübersicht', fahrten });
  } catch (e) {
    res.status(500).send('Fehler beim Laden');
  }
});

// Fahrt anlegen (Formular - GET)
router.get('/fahrten/anlegen', (req, res) => {
  res.render('anlegen', { title: 'Fahrt anlegen', info: null });
});

// Fahrt anlegen (POST)
router.post('/fahrten/anlegen', async (req, res) => {
  try {
    const { start, ziel, plaetze, datum, preis } = req.body;
    await Fahrt.create({
      start, ziel,
      plaetze: parseInt(plaetze || 1, 10),
      datum: datum || null,
      preis: preis ? parseFloat(preis) : null
    });
    res.render('anlegen', { title: 'Fahrt anlegen', info: 'Fahrt gespeichert!' });
  } catch (e) {
    res.status(500).send('Fehler beim Speichern');
  }
});

// Fahrt abfragen (GET, sehr einfache Suche)
router.get('/fahrten/abfragen', async (req, res) => {
  try {
    const { start, ziel } = req.query;
    let fahrten = [];
    if (start || ziel) {
      const where = {};
      if (start) where.start = start;
      if (ziel) where.ziel = ziel;
      fahrten = await Fahrt.findAll({ where });
    }
    res.render('abfragen', { title: 'Fahrt abfragen', fahrten, start: start || '', ziel: ziel || '' });
  } catch (e) {
    res.status(500).send('Fehler bei der Abfrage');
  }
});

module.exports = router;
