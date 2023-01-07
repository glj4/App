const Experience = require('../models/userExperience');

const experienceCtrl = {};

experienceCtrl.getExperiences = async (req, res) => {
    const opciones = {
        limit: parseInt(req.query.limit, 10) || 10,
        page: parseInt(req.query.page, 10) || 1
    };
    
    try{
        const datos = await Experience.paginate({}, opciones)
        return res.status(200).json(datos)
    }
    catch(error){
        return res.status(202).json({ message: 'No se puede paginar. ' + error.message})
    }
};

experienceCtrl.getExperience = async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    res.json(experience);
};

experienceCtrl.createExperience = async (req, res) => {
    const experience = new Experience(req.body);
    await experience.save();
    res.json({
        status: 'Experience saved'
    });
};

experienceCtrl.updateExperience = async (req, res) => {
    const { id } = req.params;
    const experience = {
        user: req.body.user,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        finalPrice: req.body.finalPrice,
        images: req.body.images,
        isPublished: req.body.isPublished
    };
    await Experience.findByIdAndUpdate(id, {$set: experience}, {new: true});
    res.json({status: 'Experience update'});
};

experienceCtrl.deleteExperience = async (req, res) => {
    await Experience.findByIdAndRemove(req.params.id);
    res.json({status: 'Experience deleted'});
};

module.exports = experienceCtrl;