const nodemailer = require('nodemailer');
const user = require('../models/user');
const contactCtrl = {};

contactCtrl.contactUs = async (req, res) => {
    if (req.body.email == "") {
        res.status(400).send({
            message: 'El email es requerido'
        });
    }

    if (req.body.textarea == "") {
        res.status(400).send({
            message: 'La pregunta es requerida'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'app.turistea@gmail.com',
                pass: 'vltybkwpqtspoocl'
            }
        });

        const mailOptions = {
            from: req.body.email,
            to: 'app.turistea@gmail.com',
            subject: `Duda del usuario ${req.body.email}`,
            text: `Teléfono de contacto: ${req.body.phone}\n Pregunta: ${req.body.textarea}`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Ha ocurrido un error: ', err);
            } else {
                console.log('Respuesta: ', response);
                res.status(200).json({
                    message: 'El email ha sido enviado'
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Ha ocurrido un error',
            error
        });
    }
};

module.exports = contactCtrl;