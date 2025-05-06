const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const signup = async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  try {
    // Check existing users
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        email: email || undefined,
        password: hashedPassword,
        role: 'PATIENT'
      }
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { phoneNumber, email, username, password } = req.body;

  try {
    // Find user by any identifier
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(phoneNumber ? [{ phoneNumber }] : []),
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : []),
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyToken = async (req, res) => {
  // This would be called after the auth middleware verifies the token
  res.status(200).json({ valid: true });
};

const logoutUser = (req, res) => {
  try {
    // Clear the token from cookies
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });

    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed. Try again." });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT'
      }
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getPatientMeasurements = async (req, res) => {
  const { patientId } = req.params;

  try {
    const measurements = await prisma.healthMeasurement.findMany({
      where: {
        patientId: String(patientId)
      }
    });

    res.status(200).json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { signup, login, verifyToken,logoutUser, getAllPatients, getPatientMeasurements };