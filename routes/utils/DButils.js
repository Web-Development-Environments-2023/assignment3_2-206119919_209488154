require("dotenv").config();
const MySql = require("./MySql");

exports.execQuery = async function (query) {
  let returnValue = [];
  const connection = await MySql.connection();
  try {
    await connection.query("START TRANSACTION");
    returnValue = await connection.query(query);
  } catch (err) {
    await connection.query("ROLLBACK");
    console.log('ROLLBACK at querySignUp', err);
    throw err;
  } finally {
    await connection.release();
  }
  return returnValue
}

exports.setMetaFields = async(recipes, user_id) => {
  recipes = await setWatchedRecipes(recipes, user_id);
  recipes = await setCreatedRecipes(recipes, user_id);
  recipes = await setFavoriteRecipes(recipes, user_id);

  return recipes;
}

const setWatchedRecipes = async (recipes, user_id) => {
  const watched = await this.execQuery(`SELECT * FROM watched_recipes WHERE user_id='${user_id}';`);
  return recipes.map(recipe => {
    return {
      ...recipe,
      isWatched: watched.some(x => x.recipe_id.toString() === recipe.id.toString())
    };
  });
}

const setCreatedRecipes = async (recipes, user_id) => {
  const created = await this.execQuery(`SELECT * FROM user_recipes WHERE user_id='${user_id}';`);
  return recipes.map(recipe => {
    return {
      ...recipe,
      isCreated: created.some(x => x.id.toString() === recipe.id.toString())
    };
  });
}

const setFavoriteRecipes = async (recipes, user_id) => {
  const favorites = await this.execQuery(`SELECT * FROM favorite_recipes WHERE user_id='${user_id}';`);
  return recipes.map(recipe => {
    return {
      ...recipe,
      isFavorite: favorites.some(x => x.recipe_id.toString() === recipe.id.toString())
    };
  });
}