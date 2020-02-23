const IngredientModel = require("../models/ingredientModel");
const mongoose = require("mongoose");

module.exports = {
  create: (req, res) => {
    let ingredient = new IngredientModel({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: req.body.name,
      restockHistory: req.body.restockHistory,
      image: req.body.image
    });

    ingredient
      .save()
      .then(result => {
        res.json({ success: true, result: result });
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  }
};
