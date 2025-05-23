const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../Middleware/passportConfig');
const router = express.Router();

const { insertLoginHistory } = require("../Utility/gift.helpers.utils")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log(JWT_SECRET_KEY, "kkkkkkk")

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
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNTIzOTkzODE5NjgwOTY2ODA0OSIsImVtYWlsIjoibXVydGh5a2ljaHVAZ21haWwuY29tIiwiaWF0IjoxNzEyMTQzMjE5fQ.rCContraosnIfm4gYBKLoVE_m5Xv4V3hGPSy3Wr1rsQ
            // console.log(user,req.user,info,"gfgccghgchcgchghcghc");

            // console.log("tokeennenenenenneneneeee", req.user)
            // console.log("req.body", req.hostname, req.originalUrl,)

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
