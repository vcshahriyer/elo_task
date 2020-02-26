const RecipeModel = require("../models/recipeModel");
const IngredientModel = require("../models/ingredientModel");
const mongoose = require("mongoose");

module.exports = {
  create: (req, res) => {
    let recipe = new RecipeModel({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: req.body.name,
      image: req.body.image,
      Ingredients: req.body.Ingredients,
      Recipes: req.body.Recipes,
      restockHistory: req.body.restockHistory
    });

    recipe
      .save()
      .then(result => {
        res.json({ success: true, result: result });
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  },
  update: (req, res) => {
    RecipeModel.update({ _id: req.body._id }, req.body)
      .then(recipe => {
        if (!recipe) res.json({ success: false, result: "No recipe found !" });
        res.json({ success: true, result: recipe });
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  },
  restock: (req, res) => {
    RecipeModel.update(
      { _id: req.body._id },
      { $push: { restockHistory: req.body.restockHistory } }
    )
      .then(recipe => {
        if (!recipe) res.json({ success: false, result: "No recipe found !" });
        res.json({ success: true, result: recipe });
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  },
  getrecipes: (req, res) => {
    RecipeModel.find().exec(function(err, recipe) {
      if (err) return res.json({ success: false, result: err });
      res.json({ success: true, result: recipe });
    });
  },
  get: (req, res) => {
    RecipeModel.findOne({ _id: req.params.id })
      .populate({ path: "Recipes._id", populate: { path: "Recipes._id" } })
      .populate("Ingredients._id")
      .exec(function(err, recipe) {
        if (err) return res.json({ success: false, result: err });
        res.json({ success: true, result: recipe });
      });
  },
  getRecipeCost: (req, res) => {
    RecipeModel.find(
      { _id: req.params.id },
      { restockHistory: { $slice: -1 } }
    ).exec(function(err, recipe) {
      if (err) return res.json({ success: false, result: err });
      res.json({ success: true, result: recipe });
    });
  },
  delete: (req, res) => {
    RecipeModel.findById({ _id: req.params.id }, (err, recipe) => {
      RecipeModel.update(
        { Recipes: { $elemMatch: { _id: recipe._id } } }, // matching recipe _id to all other recipe which has that recipe as dependency.
        { $pull: { Recipes: { _id: recipe._id } } } // deletingn the ref dependency of deleted recipe
      )
        .then(resp => {
          if (!resp) res.json({ success: false, result: "No recipe found !" });
          recipe.remove();
          res.json({ success: true, result: "Delete successful !" });
        })
        .catch(err => {
          res.json({ success: false, result: err });
        });
    });
  }
};
