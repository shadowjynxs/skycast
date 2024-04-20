const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email address is already in use' });
        }

        const user = await User.create(req.body);
        // res.redirect('/login')
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    var { emailValue, passwdValue } = req.body;
    let email = emailValue
    let passwd = passwdValue
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordMatch = passwd === user.password ? true : false;

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = { email: user.email, name: user.name};

        return res.status(200).json({ success: 'User found' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


