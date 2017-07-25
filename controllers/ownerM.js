const OwnerM = require('../models/ownerM');

module.exports = {

  index: async (req, res, next) => {
    OwnerM.find({}).sort({ orderby : 'asc'}).exec (function(err, ownerMs) {
      res.status(200).json(ownerMs);
    });
  },

  getOwnerM: async (req, res, next) => {
    const { ownermid } = req.value.params;
    const ownerM = await OwnerM.findById(ownermid);
    res.status(200).json(ownerM);
  },

  newOwnerM: async (req, res, next) => {
    const newOwnerM = new OwnerM(req.value.body);
    const ownerM = await newOwnerM.save();
    res.status(201).json(ownerM);
  },

  deleteOwnerM: async (req, res, next) => {
    const { ownermid } = req.value.params;
    const ownerM = await OwnerM.findByIdAndRemove(ownermid);
    res.status(200).json({ success: true });
  },

  replaceOwnerM: async (req, res, next) => {
    const { ownermid } = req.value.params;
    const newProps = req.value.body;
    const ownerMToReplace = await OwnerM.findByIdAndUpdate(ownermid, newProps);
    res.status(200).json({ success: true });
  },

  updateOwnerM: async (req, res, next) => {
    const { ownermid } = req.value.params;
    const newProps = req.value.body;
    const ownerMToUpdate = await OwnerM.findByIdAndUpdate(ownermid, newProps);
    res.status(200).json({ success: true });
  }

};
