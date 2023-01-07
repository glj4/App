const express = require('express');
const router = express.Router();

const hotel = require('../controllers/hotel.controller');

router.get('/', hotel.getHotels);
router.post('/', hotel.createHotel);
router.get('/:id', hotel.getHotel);
router.put('/:id', hotel.updateHotel);
router.delete('/:id', hotel.deleteHotel);

module.exports = router;
