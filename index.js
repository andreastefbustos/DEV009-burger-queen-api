require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();
mongoose.connect(config.dbUrl);

const database = mongoose.connection;

database.on('error', (error) => {
  console.error(error);
});

database.once('connected', () => {
  console.info('Database Connected');
});

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
