const User = require('../models/user');

const userCtrl = {};

userCtrl.getUsers = async (req, res) => {
    const opciones = {
        limit: parseInt(req.query.limit, 10) || 10,
        page: parseInt(req.query.page, 10) || 1
    };
    
    try{
        const datos = await User.paginate({}, opciones)
        return res.status(200).json(datos)
    }
    catch(error){
        return res.status(202).json({ message: 'No se puede paginar. ' + error.message})
    }
};

userCtrl.getUserByEmail = async (req, res) => {
    User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                mensaje: err
            });
        }

        if (user) {
            res.json(user);
        }
    });
};

userCtrl.createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({
        status: 'User saved'
    });
};

userCtrl.updateUser = async (req, res) => {
    const { id } = req.params;
    const userSaved = await User.findById(id);
    const user = {
        name: req.body.name != undefined ? req.body.name : userSaved.name,
        surname: req.body.surname != undefined ? req.body.surname : userSaved.surname,
        phone: req.body.phone != undefined ? req.body.phone : userSaved.phone,
        password: req.body.password != undefined ? req.body.password : userSaved.password,
        points: req.body.points != undefined ? req.body.points : userSaved.points,
        bookings: req.body.bookings != undefined ? req.body.bookings : userSaved.bookings,
        trips: req.body.trips != undefined ? req.body.trips : userSaved.trips,
        favorites: req.body.favorites != undefined ? req.body.favorites : userSaved.favorites,
        likes: req.body.likes != undefined ? req.body.likes : userSaved.likes
    };
    await User.findByIdAndUpdate(id, {$set: user}, {new: true});
    res.json({status: 'User update'});
};

userCtrl.deleteUser = async (req, res) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({status: 'User deleted'});
};

module.exports = userCtrl;