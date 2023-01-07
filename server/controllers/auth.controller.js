'use strict';

const mongoose = require('mongoose');
const user = require('../models/user');
const User = require('../models/user');
const service = require('../services/index.login');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const authCtrl = {};

authCtrl.signUp = async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Campos obligatorios'
        });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        if (user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario ya existe'
            });
        }

        try {
            const user = new User(req.body);
            user.save();
            const token = service.createToken(user);
            res.status(201).send({ user, token });
        } catch (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al registrar el usuario'
            });
        }
    });
}

authCtrl.signIn = async (req, res) => {
    var body = req.body;
    User.findOne({ email: body.email }, (err, userBD) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!userBD){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if(body.password != userBD.password){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }
        
        var token = service.createToken(userBD);

        res.status(200).json({
            ok: true,
            user: userBD,
            token: token,
            id: userBD._id
        });
    });
};

authCtrl.forgotPassword = async (req, res) => {
    if (req.body.email == "") {
        res.status(400).send({
            message: 'El email es requerido'
        });
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(403).send({
                message: 'El email no está registrado.'
            });
        }

        const token = jwt.sign({ id: user.id }, 'esternocleidomastoideo', { expiresIn: "1h" });
        user.update({
            tokenResetPassword: token
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'app.turistea@gmail.com',
                pass: 'vltybkwpqtspoocl'
            }
        });

        const mailOptions = {
            from: 'app.turistea@gmail.com',
            to: user.email,
            subject: 'Enlace para recuperar su cuenta de Turistea',
            text: `http://localhost:8100/new-password?id=${user.id}&tokenResetPassword=${token}`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Ha ocurrido un error: ', err);
            } else {
                console.log('Respuesta: ', response);
                res.status(200).json({
                    message: 'El email para la recuperación ha sido enviado'
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Ha ocurrido un error',
            error
        });
    }
}

authCtrl.resetPassword = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const resetPassword = await User.update(req.body, {
            id: req.params.id,
            tokenResetPassword: req.params.tokenResetPassword
        });
        res.status(201).send({
            message: 'Contraseña cambiada con éxito'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error al resetear la contraseña',
            error
        });
    }
}

module.exports = authCtrl;