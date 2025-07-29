const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../Middleware/passportConfig');
const router = express.Router();
const authController = require('../Controllers/authController.js');

const { insertLoginHistory } = require("../Utility/gift.helpers.utils")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log(JWT_SECRET_KEY, "kkkkkkk")

// ---NEW ROUTES ---
router.post('/register', authController.registerUser);

// Handles POST to /login
router.post('/login', authController.loginUser);

// opt POST in Register
router.post('/verify-otp', authController.verifyOtp);




router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            console.log(err, "sasdasd")
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication Failed' });
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            
            const user_domain = req.user.email.split('@')[1].split('.')[0];
            console.log("user_domain", user_domain);

            const responseFromGift = await insertLoginHistory(
                req.hostname,
                req.originalUrl,
                req.headers["user-agent"] || "Unknown",
                req.user.email,
                "sso",
                user_domain
            );
            
            const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET_KEY,{expiresIn: '24h'});
            console.log(token)
            res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}&user_id=${user.id}`);

        });
    })(req, res, next);
});

module.exports = router;