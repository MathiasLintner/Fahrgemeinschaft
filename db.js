// myExpressApp/db.js
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const isAzure = !!process.env.WEBSITE_SITE_NAME; // App Service setzt diese VAR automatisch
const localDataDir = path.join(__dirname, 'data');
const azureDataDir = '/home/data';

const dbDir = isAzure ? azureDataDir : localDataDir;
try { fs.mkdirSync(dbDir, { recursive: true }); } catch (e) {}

const storagePath = process.env.SQLITE_PATH || path.join(dbDir, 'app.db');

// Falls du später eine Cloud-DB nutzen willst, setze DATABASE_URL und DIALECT
const hasCloudDb = !!process.env.DATABASE_URL;
const sequelize = hasCloudDb
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: process.env.DIALECT || 'postgres', // oder 'mysql'/'mssql'
      dialectOptions: process.env.DB_SSL ? { ssl: { require: true } } : {}
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false
    });

module.exports = { sequelize };
