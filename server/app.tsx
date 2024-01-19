const express = require('express');
const app = express();
var dotenv = require('dotenv').config({ path: `${__dirname}/.env` });
var LocalStorage = require('node-localstorage').LocalStorage;
LocalStorage = new LocalStorage('./scratch');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());

var mongo_uri = process.env.MONGO_URI;
