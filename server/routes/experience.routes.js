const express = require('express');
const router = express.Router();

const experience = require('../controllers/experience.controller');

router.get('/', experience.getExperiences);
router.post('/', experience.createExperience);
router.get('/:id', experience.getExperience);
router.put('/:id', experience.updateExperience);
router.delete('/:id', experience.deleteExperience);

module.exports = router;
