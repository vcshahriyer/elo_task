const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  _id: { type: Schema.ObjectId },
  name: { type: String, required: true },
  image: String,
  Ingredients: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "ingredient" },
      usedQuantity: Number
    }
  ],

  Recipes: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "recipe" },
      usedQuantity: Number
    }
  ],
  restockHistory: [
    {
      quantity: Number,
      unitCost: Number
    }
  ]
});

module.exports = mongoose.model("recipe", RecipeSchema);
