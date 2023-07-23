var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");

router.get("/", (req, res) => {
  res.send("im here");
});

/**
 * This path returns the preview details of a recipe by its id
 */
router.get("/:recipeId/preview", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send((await DButils.setMetaFields([recipe], user_id))[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns all the family recipes
 */
router.get("/family", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const result = await recipes_utils.getFamilyRecipes();
    res.send(await DButils.setMetaFields(result, user_id));
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns 3 random recipes
 */
router.get("/random", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const result = await recipes_utils.getRandomRecipes();
    res.send(await DButils.setMetaFields(result, user_id));
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns x recipes
 */
router.get("/search", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const result = await recipes_utils.search(req.query);
    const meta_res = await DButils.setMetaFields(result, user_id);
    res.send(meta_res);
  } catch (error) {
    console.log("ERROR: ", error);
    next(error);
  }
});

/**
 * This path returns the full details of a recipe by its id
 */
router.get("/recipe/:recipeId", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const response = await recipes_utils.getRecipeById(user_id, req.params.recipeId);
    const result = await DButils.setMetaFields([response], user_id);
    res.send(result[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
