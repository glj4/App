const Hotel = require('../models/hotel');

const hotelCtrl = {};

hotelCtrl.getHotels = async (req, res) => {
    const opciones = {
        limit: parseInt(req.query.limit, 10) || 10,
        page: parseInt(req.query.page, 10) || 1
    };
    
    try{
        const datos = await Hotel.paginate({}, opciones)
        return res.status(200).json(datos)
    }
    catch(error){
        return res.status(202).json({ message: 'No se puede paginar. ' + error.message})
    }
};

hotelCtrl.getHotel = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.json(hotel);
};

hotelCtrl.createHotel = async (req, res) => {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.json({
        status: 'Hotel saved'
    });
};

hotelCtrl.updateHotel = async (req, res) => {
    const { id } = req.params;
    const hotelSaved = await Hotel.findById(id);
    const hotel = {
        name: req.body.name != undefined ? req.body.name : hotelSaved.name,
        description: req.body.description != undefined ? req.body.description : hotelSaved.description,
        location: req.body.location != undefined ? req.body.location : hotelSaved.location,
        price: req.body.price != undefined ? req.body.price : hotelSaved.price,
        people: req.body.people != undefined ? req.body.people : hotelSaved.people,
        rooms: req.body.rooms != undefined ? req.body.rooms : hotelSaved.rooms,
        bookings: req.body.bookings != undefined ? req.body.bookings : hotelSaved.bookings,
        images: req.body.images != undefined ? req.body.images : hotelSaved.images,
        parking: req.body.parking != undefined ? req.body.parking : hotelSaved.parking,
        buffet: req.body.buffet != undefined ? req.body.buffet : hotelSaved.buffet,
        ubication: req.body.ubication != undefined ? req.body.ubication : hotelSaved.ubication
    };
    await Hotel.findByIdAndUpdate(id, {$set: hotel}, {new: true});
    res.json({status: 'Hotel update'});
};

hotelCtrl.deleteHotel = async (req, res) => {
    await Hotel.findByIdAndRemove(req.params.id);
    res.json({status: 'Hotel deleted'});
};

module.exports = hotelCtrl;