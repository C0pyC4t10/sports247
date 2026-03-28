const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const userStore = require('../services/userStore');
const jwt = require('jsonwebtoken');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
    const allUsers = userStore.getAllUsers();
    let user = null;
    
    for (const u of allUsers.values()) {
      if (u.googleId === profile.id) {
        user = u;
        break;
      }
    }
    
    if (!user) {
      const newUser = {
        id: allUsers.size + 1,
        username: profile.displayName || profile.emails[0].value.split('@')[0],
        email: profile.emails[0].value,
        password: '',
        googleId: profile.id,
        role: 'user',
        credits: 10,
        avatar: profile.photos[0]?.value || '',
        createdAt: new Date()
      };
      allUsers.set(newUser.id, newUser);
      user = newUser;
    }
    
    return done(null, user);
  }));
  
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = userStore.getUserById(id);
    done(null, user);
  });
}

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({ 
      success: false, 
      message: 'Google OAuth not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file.' 
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    res.redirect(`http://localhost:5000/auth/callback?token=${token}`);
  }
);

module.exports = router;