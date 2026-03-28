const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET || 'vikingvision_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, '../../client/dist')));

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/user', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected');
      startServer();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Starting server without database...');
      startServer();
    });
} else {
  console.log('No MongoDB URI configured, starting server without database...');
  startServer();
}

module.exports = app;