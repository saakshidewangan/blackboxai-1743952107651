const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

// Signup with Firebase
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Create Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false
    });

    // Create local user record
    const user = await User.create({
      firebaseUid: userRecord.uid,
      email
    });

    // Generate custom token for client
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Login with Firebase
exports.login = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};