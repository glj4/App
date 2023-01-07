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
    const hotel = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        people: req.body.people,
        available: req.body.available,
        rooms: req.body.rooms,
        bookings: req.body.bookings,
        images: req.body.images,
        parking: req.body.parking,
        buffet: req.body.buffet
    };
    await Hotel.findByIdAndUpdate(id, {$set: hotel}, {new: true});
    res.json({status: 'Hotel update'});
};

hotelCtrl.deleteHotel = async (req, res) => {
    await Hotel.findByIdAndRemove(req.params.id);
    res.json({status: 'Hotel deleted'});
};

module.exports = hotelCtrl;