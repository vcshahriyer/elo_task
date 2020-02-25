const express = require("express");
const mongoose = require("mongoose");
const app = express();

//Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/elo", { useNewUrlParser: true })
  .then(() => console.log("Connected to database..."))
  .catch(err => console.error(err));

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Controllers
const IngredientController = require("./controllers/IngredientController");
const RecipeController = require("./controllers/RecipeController");

// Routes
app.post("/api/ingredient/add", IngredientController.create);
app.post("/api/recipe/add", RecipeController.create);
app.post("/api/recipe/update", RecipeController.update);
app.post("/api/ingredient/update", IngredientController.update);
app.post("/api/recipe/push-restock", RecipeController.restock);
app.get("/api/get-recipes", RecipeController.getrecipes);
app.get("/api/get-recipe/:id", RecipeController.get);
app.get("/api/get-ingredients", IngredientController.getingredients);
app.get("/api/get-ingredient/:id", IngredientController.getingredient);
app.get("/api/get-ingredient-cost/:id", RecipeController.getRecipeCost);
app.delete("/api/delete-recipe/:id", RecipeController.delete);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));
