// myExpressApp/routes/index.js
var express = require('express');
var router = express.Router();
const Fahrt = require('../models/Fahrt');

const PREIS_PRO_KM = parseFloat(process.env.PREIS_PRO_KM || '0.5');

router.get('/', (req, res) => res.redirect('/fahrten'));

router.get('/fahrten', async (req, res) => {
  try {
    const fahrten = await Fahrt.findAll({ order: [['createdAt','DESC']] });
    res.render('index', { title: 'Fahrtenübersicht', fahrten });
  } catch (e) {
    res.status(500).send('Fehler beim Laden');
  }
});

router.get('/fahrten/anlegen', (req, res) => {
  res.render('anlegen', { title: 'Fahrt anlegen', info: null, preisProKm: PREIS_PRO_KM });
});

router.post('/fahrten/anlegen', async (req, res) => {
  try {
    const { start, ziel, plaetze, datum, uhrzeit, distanz, gebaeck } = req.body;

    const km = parseFloat(distanz || '0') || 0;
    const preis = Math.round(km * PREIS_PRO_KM * 100) / 100;

    // "gebaeck" kommt aus hidden input als 'true' / 'false' (vom Toggle-Button)
    const gebaeckErlaubt = (gebaeck === 'true' || gebaeck === 'on' || gebaeck === '1');

    await Fahrt.create({
      start,
      ziel,
      plaetze: parseInt(plaetze || 1, 10),
      datum: datum || null,
      uhrzeit: uhrzeit || null,
      distanz: km,
      preis,
      gebaeckErlaubt
    });

    res.render('anlegen', { title: 'Fahrt anlegen', info: `Fahrt gespeichert! Preis: ${preis.toFixed(2)} €`, preisProKm: PREIS_PRO_KM });
  } catch (e) {
    res.status(500).send('Fehler beim Speichern');
  }
});

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


router.post('/fahrten/:id/loeschen', async (req, res) => {
  try {
    const id = req.params.id;
    const count = await Fahrt.destroy({ where: { id } });
    if (count === 0) return res.status(404).send('Eintrag nicht gefunden');
    const back = req.get('Referer') || '/fahrten';
    res.redirect(back);
  } catch (e) {
    console.error(e);
    res.status(500).send('Fehler beim Löschen');
  }
});

module.exports = router;
