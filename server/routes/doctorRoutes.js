const express = require('express');
const router = express.Router();
const { doctorSignup } = require('../controllers/doctorController');
const { getAllPatients } = require('../controllers/authController');
const { getPatientMeasurements } = require('../controllers/authController');
const validateDoctorSignup = require('../middleware/validateDoctorSignup');

// Route for doctor signup
router.post('/signup', validateDoctorSignup, doctorSignup);

// Route to fetch all patients
router.get('/Patients', getAllPatients);

//Route to fetch patoent measurements
router.get('/Patients/:patientId/measurements',validateDoctorSignup, getPatientMeasurements);

module.exports = router;