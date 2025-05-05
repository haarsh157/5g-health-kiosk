// server/routes/heightRoutes.js

const express = require('express');
const { measureHeight } = require('../controllers/heightController');

const router = express.Router();

router.get('/measure-height', measureHeight);

module.exports = router;
