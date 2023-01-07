const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');

router.get('/', user.getUsers);
router.post('/', user.createUser);
router.get('/:email', user.getUserByEmail);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);

module.exports = router;
