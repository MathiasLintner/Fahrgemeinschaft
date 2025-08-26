// myExpressApp/models/Fahrt.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Fahrt = sequelize.define('Fahrt', {
  start:   { type: DataTypes.STRING, allowNull: false },
  ziel:    { type: DataTypes.STRING, allowNull: false },
  plaetze: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  datum:   { type: DataTypes.DATEONLY, allowNull: true },
  uhrzeit: { type: DataTypes.STRING, allowNull: true },
  distanz: { type: DataTypes.FLOAT, allowNull: true },
  preis:   { type: DataTypes.FLOAT, allowNull: true },
  // NEU: Gebäck erlaubt?
  gebaeckErlaubt: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
});

module.exports = Fahrt;
