const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password does not match'
            });
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 });
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ["HS256"]
});

exports.jwtVerification = (req, res, next) => {
    if (!req.headers['authorization']) {
      return res.status(400).json({ success: false, message: 'No access token provided' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.userId = decoded._id;
      req.role = decoded.role;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

exports.isAdmin = (req, res, next) => {
    if (req.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

