const AppError = require('../utils/AppError');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'user' });
    const token = signToken(user._id, user.role);
    res.status(201).json({
      status: 'success',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log(' Login attempt:');
    console.log('  Email:', email);
    console.log('  Password from request:', password);
    
    if (!email || !password) {
      return next(new AppError('Укажите email и пароль', 400));
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    console.log('  User found:', !!user);
    if (user) {
      console.log('  User email:', user.email);
      console.log('  Password from DB:', user.password);
      console.log('  Password length:', user.password.length);
    }
    
    if (!user) {
      console.log('User not found');
      return next(new AppError('Неверный email или пароль', 401));
    }
    
    console.log('  Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('  Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return next(new AppError('Неверный email или пароль', 401));
    }
    
    console.log('Login successful');
    const token = signToken(user._id, user.role);
    
    res.status(200).json({
      status: 'success',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};