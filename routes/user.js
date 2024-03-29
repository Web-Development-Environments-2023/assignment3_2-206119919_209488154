var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {

      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => {
      console.log("ERROR: ", err);
      next(err);
    });
  } else {
    res.sendStatus(401);
  }
});


router.get('/me', async (req, res, next) => {
  try {
    if(req.session && req.session.user_id) {
      DButils.execQuery(`SELECT * FROM users WHERE user_id = ${req.session.user_id}`)
      .then((user) => {
        res.status(200).send(user);
      });
    }
  } catch(error) {
    next(error)
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(await DButils.setMetaFields(results, user_id));
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
router.post('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsWatched(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved to watched");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the watched recipes that were watched by the logged-in user
 */
router.get('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let watched_recipes = {};
    const recipes_id = await user_utils.getWatchedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(await DButils.setMetaFields(results, user_id));
  } catch(error){
    next(error); 
  }
});


/**
 * This path gets body with a recipe and save it in the list of recipes created by the logged-in user
 */
router.post('/created', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe = req.body.recipe;
    await user_utils.createRecipe(user_id, recipe);
    res.status(200).send("The Recipe was successfully created");
  } catch(error){
    next(error);
  }
});


/**
 * This path returns the recipes that were created by the logged-in user
 */
router.get('/created', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getCreatedRecipes(user_id);
    res.status(200).send(await DButils.setMetaFields(recipes, user_id));
  } catch(error){
    next(error); 
  }
});

module.exports = router;
