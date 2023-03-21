require('dotenv').config();
const express = require('express');
const app = express();
const { connect } = require('./config/database');

const cookies = require('cookie-parser');
const session = require('express-session');
const { initializePassport } = require('./config/passport');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoustes = require('./routes/adminRoutes');
const checkRoustes = require('./test');

const { ValidationError } = require('express-validation');

const { login } = require('./services/userDataValidation');
app.use(cookies());
app.use(session({ secret: process.env.SESSION_SECERET, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

initializePassport();
connect();

const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use('/posts/', express.static('public'));
app.use('/admin/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminRoustes);
app.use('/check', checkRoustes);

app.get('/', (req, res) => {
    res.redirect('/posts');
})

app.get('/login', (req, res) => {
    res.render('loginPage');
});

app.get('/register', (req, res) => {
    res.render('registerUserPage');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err.details.body);
    }
    return res.status(500).json(err)
})

app.listen(port, () => {
    console.log(`Listening port : ${port}`);
});