var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => {
  res.send("im here");
});

/**
 * This path returns the preview details of a recipe by its id
 */
router.get("/:recipeId/preview", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns all the family recipes
 */
router.get("/family", async (req, res, next) => {
  try {
    res.send(await recipes_utils.getFamilyRecipes());
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns 3 random recipes
 */
router.get("/random", async (req, res, next) => {
  try {
    res.send(await recipes_utils.getRandomRecipes());
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns x recipes
 */
router.get("/search", async (req, res, next) => {
  try {
    res.send(await recipes_utils.search(req.query));
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the full details of a recipe by its id
 */
router.get("/recipe/:recipeId", async (req, res, next) => {
  try {
    const { data } = await recipes_utils.getRecipeById(req.params.recipeId);
    res.send(data);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
