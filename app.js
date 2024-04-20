const express = require('express')
const path = require('path');
const app = express();
const session = require('express-session');



const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/routes')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for session management
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/', appRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
