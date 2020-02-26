const IngredientModel = require("../models/ingredientModel");
const RecipeModel = require("../models/recipeModel");
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
  },
  update: (req, res) => {
    IngredientModel.update(
      { _id: req.body._id },
      { $push: { restockHistory: req.body.restockHistory } }
    )
      .then(ingredient => {
        if (!ingredient)
          res.json({ success: false, result: "No Ingredient found !" });
        res.json({ success: true, result: ingredient });
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  },
  restock: (req, res) => {
    IngredientModel.update(
      { _id: req.body._id },
      { $push: { restockHistory: req.body.restockHistory } }
    )
      .then(resp => {
        if (!resp | (resp.n === 0))
          res.json({ success: false, result: "No recipe found !" });
        res.json({ success: true, result: resp });
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  },
  getingredients: (req, res) => {
    IngredientModel.find().exec(function(err, ingredient) {
      if (err) return res.json({ success: false, result: err });
      res.json({ success: true, result: ingredient });
    });
  },
  getingredient: (req, res) => {
    IngredientModel.findOne({ _id: req.params.id }).exec(function(
      err,
      ingredient
    ) {
      if (err) return res.json({ success: false, result: err });
      res.json({ success: true, result: ingredient });
    });
  },
  delete: (req, res) => {
    IngredientModel.findById({ _id: req.params.id }, (err, ingredient) => {
      RecipeModel.update(
        { Ingredients: { $elemMatch: { _id: ingredient._id } } }, // matching ingredient _id to all other recipe which has that ingredient as dependency.
        { $pull: { Ingredients: { _id: ingredient._id } } } // deletingn the ref dependency of deleted ingredient
      )
        .then(resp => {
          if (!resp)
            res.json({ success: false, result: "No Ingredient found !" });
          ingredient.remove();
          res.json({ success: true, result: "Delete successful !" });
        })
        .catch(err => {
          res.json({ success: false, result: err });
        });
    });
  }
};
