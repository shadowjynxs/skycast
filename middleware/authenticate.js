const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = isLoggedIn