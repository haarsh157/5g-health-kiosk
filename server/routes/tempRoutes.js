// server/routes/temperatureRoutes.js

const express = require('express');
const { getTemperature } = require('../controllers/tempController');

const router = express.Router();

router.get('/measure-temperature', getTemperature);

module.exports = router;
