// myExpressApp/models/Fahrt.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Fahrt = sequelize.define('Fahrt', {
  start:   { type: DataTypes.STRING, allowNull: false },
  ziel:    { type: DataTypes.STRING, allowNull: false },
  plaetze: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  datum:   { type: DataTypes.DATEONLY, allowNull: true },
  preis:   { type: DataTypes.FLOAT, allowNull: true }
});

module.exports = Fahrt;
