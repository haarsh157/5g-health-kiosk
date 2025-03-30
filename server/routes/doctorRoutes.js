const express = require('express');
const router = express.Router();
const { doctorSignup } = require('../controllers/doctorController');
const validateDoctorSignup = require('../middleware/validateDoctorSignup');

router.post('/signup', validateDoctorSignup, doctorSignup);

module.exports = router;