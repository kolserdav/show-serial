// @ts-check
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { SERIAL_PATH } = process.env;

const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/favicon.ico', express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'home' });
});

app.get('/:id', function (req, res) {
  const { params } = req;
  const { id } = params;
  let seriesNum = parseInt(id, 10);
  seriesNum = Number.isNaN(seriesNum) ? 1 : seriesNum;
  const prev = seriesNum - 1;
  const next = seriesNum + 1;
  res.render('index', { id, prev, next, title: 'player' });
});

app.use('/serial', express.static(SERIAL_PATH));

app.listen(80);
