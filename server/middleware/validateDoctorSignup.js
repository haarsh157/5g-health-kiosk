const { body } = require('express-validator');

const validateDoctorSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Invalid phone number format'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('licenseNumber')
    .trim()
    .notEmpty().withMessage('License number is required'),
  body('specialty')
    .trim()
    .notEmpty().withMessage('Specialty is required')
];

module.exports = validateDoctorSignup;