import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import './config/passport.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});
