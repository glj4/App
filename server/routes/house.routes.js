const express = require('express');
const router = express.Router();

const house = require('../controllers/country-house.controller');

router.get('/', house.getHouses);
router.post('/', house.createHouse);
router.get('/:id', house.getHouse);
router.put('/:id', house.updateHouse);
router.delete('/:id', house.deleteHouse);

module.exports = router;
