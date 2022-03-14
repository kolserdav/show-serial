const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const { SERIAL_PATH } = process.env;

const app = express();

app.use('/serial', express.static(SERIAL_PATH))

app.listen(3000);