const express = require('express');
const morgan = require('morgan');
const app = express();
const auth = require('../server/middleware/auth');
const userAuth = require('../server/controllers/auth.controller')
const contact = require('../server/controllers/contact.controller')

const { mongoose } = require('./database');

var cors = require('cors')
app.use(cors())

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/hotels', require('./routes/hotel.routes'));
app.use('/api/houses', require('./routes/house.routes'));
app.use('/api/experiences', require('./routes/experience.routes'));
app.post('/api/register', userAuth.signUp);
app.post('/api/login', userAuth.signIn);
app.put('/api/forgot-password', userAuth.forgotPassword);
app.put('/api/new-password', userAuth.resetPassword);
app.put('/api/contact-us', contact.contactUs);
app.get('/api/private', auth, (req,res) => {
    res.status(200).send({ message: 'Tienes acceso' })
});

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});