const RecipeModel = require("../models/recipeModel");
const IngredientModel = require("../models/ingredientModel");
const mongoose = require("mongoose");

module.exports = {
  create: (req, res) => {
    let recipe = new RecipeModel({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: req.body.name,
      image: req.body.image,
      Ingredients: [
        {
          _id: req.body.ingredient,
          usedQuantity: req.body.ingredientQty
        }
      ],

      Recipes: [
        {
          _id: req.body.recipe,
          usedQuantity: req.body.recipeQty
        }
      ],
      restockHistory: [
        {
          quantity: req.body.num,
          unitCost: req.body.num
        }
      ]
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
  get: (req, res) => {
    // const recipe = mongoose.model('recipe', new Schema({ name: String }));
    RecipeModel.findOne({ name: req.body.name })
      .populate({ path: "Recipes._id", populate: { path: "Recipes._id" } })
      .populate("Ingredients._id")
      .exec(function(err, recipe) {
        if (err) return res.json({ success: false, result: err });
        res.json({ success: true, result: recipe });
      });
  }
};
