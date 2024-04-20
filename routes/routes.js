const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/authenticate')


router.get('/weather', isLoggedIn, (req, res) => {
    res.render('weather', { isAuthenticated: req.session.user ? true : false, userName: req.session.user });
})

router.get('/about', (req, res) => {
    res.render('about', { isAuthenticated: req.session.user ? true : false, userName: req.session.user});
})


router.get('/contact', (req, res) => {
    res.render('contact', { isAuthenticated: req.session.user ? true : false, userName: req.session.user });
})

// Routes
router.get('/', isLoggedIn, (req, res) => {
    res.render('index', { isAuthenticated: req.session.user ? true : false, userName: req.session.user });
});

router.get('/register', (req, res) => {
    res.render('register', { isAuthenticated: req.session.user ? true : false, userName: req.session.user });
});

router.get('/login', (req, res) => {
    res.render('login', { isAuthenticated: req.session.user ? true : false, userName: req.session.user });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/login');
        }
    });
});

module.exports = router;
