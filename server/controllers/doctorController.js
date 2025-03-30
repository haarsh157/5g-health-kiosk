const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const doctorSignup = async (req, res) => {
  const { name, phoneNumber, email, password, licenseNumber, specialty } = req.body;

  try {
    // Check if phone number or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber },
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.phoneNumber === phoneNumber 
          ? 'Phone number already in use' 
          : 'Email already in use'
      });
    }

    // Check if license number already exists
    const existingDoctor = await prisma.doctorProfile.findUnique({
      where: { licenseNumber }
    });

    if (existingDoctor) {
      return res.status(400).json({ 
        error: 'License number already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create transaction for both user and doctor profile
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          role: 'DOCTOR',
          name,
          phoneNumber,
          email: email || undefined,
          password: hashedPassword
        }
      });

      // Create doctor profile
      const doctorProfile = await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          licenseNumber,
          specialty
        }
      });

      return { user, doctorProfile };
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.user.id, role: 'DOCTOR' }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = result.user;

    res.status(201).json({
      message: 'Doctor registration successful',
      token,
      user: userWithoutPassword,
      doctorProfile: result.doctorProfile
    });

  } catch (error) {
    console.error('Doctor signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  doctorSignup
};