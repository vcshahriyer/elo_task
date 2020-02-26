const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");

// image file storage path and unique name+extension config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage }); // multipart form data library multer with config
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
app.post(
  "/api/ingredient/add",
  upload.single("image"),
  IngredientController.create
);
app.post("/api/recipe/add", upload.single("image"), RecipeController.create);
app.post("/api/recipe/update", RecipeController.update);
app.post("/api/ingredient/update", IngredientController.update);
app.post("/api/recipe/push-restock", RecipeController.restock);
app.post("/api/ingredient/push-restock", IngredientController.restock);
app.get("/api/get-recipes", RecipeController.getrecipes);
app.get("/api/get-recipe/:id", RecipeController.get);
app.get("/api/get-ingredients", IngredientController.getingredients);
app.get("/api/get-ingredient/:id", IngredientController.getingredient);
app.get("/api/get-recipes-cost/:id", RecipeController.getRecipeCost);
app.delete("/api/delete-recipe/:id", RecipeController.delete);
app.delete("/api/delete-ingredient/:id", IngredientController.delete);

// Start Server
const port = process.env.PORT || 3000; // checking for dynamic port set.
app.listen(port, () => console.log(`Listening on port ${port}....`));
