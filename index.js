// @ts-check
const express = require('express');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

/**
 * @type {any}
 */
const { SERIAL_PATH, NODE_ENV, HOST, FILMS_PATH } = process.env;

const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/favicon.ico', express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'home' });
});

const dir = fs.readdirSync(SERIAL_PATH);

/**
 * @type {{
 *  [key: number]: string;
 * }}
 */
const dirObj = {};
let i = 0;
do {
  i++;
  const r = dir.find((item) => new RegExp(`^${i}`).test(item));
  if (!r) {
    console.warn(`Series with number ${i} is not found`);
    continue;
  }
  dirObj[i] = r;
} while (dir[i]);

/**
 * Other films
 */
app.get('/films', (req, res) => {
  const films = fs.readdirSync(FILMS_PATH);
  res.render('index', {
    title: 'films',
    videoLinks: films.map((item) => {
      const ext = item.match(/\.\w+$/);
      const _ext = ext ? ext[0] : null;
      const type = mime.lookup(_ext || '');
      return { src: `/film/${item}`, type };
    }),
  });
});

/**
 * One series
 */
app.get('/:id', function (req, res) {
  const { params } = req;
  const { id } = params;
  let seriesNum = parseInt(id, 10);
  seriesNum = Number.isNaN(seriesNum) ? 1 : seriesNum;
  const series = dirObj[seriesNum];
  if (!series) {
    res.status(404).render('index', { title: '404' });
  }
  const prev = dirObj[seriesNum - 1] ? seriesNum - 1 : 0;
  const next = dirObj[seriesNum + 1] ? seriesNum + 1 : 0;
  const ext = dirObj[seriesNum].match(/\.\w+$/);
  const _ext = ext ? ext[0] : null;
  const type = mime.lookup(_ext || '');
  res.render('index', {
    id,
    prev,
    next,
    type,
    title: 'player',
    videoLink: `/serial/${dirObj[seriesNum]}`,
  });
});

app.use('/serial', express.static(SERIAL_PATH));
app.use('/film', express.static(FILMS_PATH));

const nodeEnv = NODE_ENV || '';
const prod = nodeEnv.trim() === 'production';
const port = prod ? 80 : 8080;

app.listen(port, () => {
  console.info(`Listen at ${HOST}:${port} ...`);
});
