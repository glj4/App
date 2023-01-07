const House = require('../models/countryHouse');

const houseCtrl = {};

houseCtrl.getHouses = async (req, res) => {
    const opciones = {
        limit: parseInt(req.query.limit, 10) || 10,
        page: parseInt(req.query.page, 10) || 1
    };
    
    try{
        const datos = await House.paginate({}, opciones)
        return res.status(200).json(datos)
    }
    catch(error){
        return res.status(202).json({ message: 'No se puede paginar. ' + error.message})
    }
};

houseCtrl.getHouse = async (req, res) => {
    const house = await House.findById(req.params.id);
    res.json(house);
};

houseCtrl.createHouse = async (req, res) => {
    const house = new House(req.body);
    await house.save();
    res.json({
        status: 'House saved'
    });
};

houseCtrl.updateHouse = async (req, res) => {
    const { id } = req.params;
    const house = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        people: req.body.people,
        available: req.body.available,
        rooms: req.body.rooms,
        bookings: req.body.bookings,
        images: req.body.images,
        baths: req.body.baths,
    };
    await House.findByIdAndUpdate(id, {$set: house}, {new: true});
    res.json({status: 'House update'});
};

houseCtrl.deleteHouse = async (req, res) => {
    await House.findByIdAndRemove(req.params.id);
    res.json({status: 'House deleted'});
};

module.exports = houseCtrl;