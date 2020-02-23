const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  _id: { type: Schema.ObjectId },
  name: { type: String, required: true },
  restockHistory: [
    {
      quantity: Number,
      unitCost: Number
    }
  ],
  image: String
});

module.exports = mongoose.model("ingredient", IngredientSchema);
