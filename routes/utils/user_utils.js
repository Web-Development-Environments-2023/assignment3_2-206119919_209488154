const DButils = require("./DButils");

let recipe_id_sequence = 1;

/**
 * Mark recipe as favorite
 * @param {*} user_id 
 * @param {*} recipe_id 
 */
async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO favorite_recipes VALUES('${user_id}',${recipe_id})`);
}

/**
 * Get favorite recipes
 * @param {*} user_id 
 */
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favorite_recipes WHERE user_id='${user_id}'`);
    return recipes_id;
}

/**
 * Mark recipe as watched
 * @param {*} user_id 
 * @param {*} recipe_id 
 */
async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO watched_recipes(user_id,recipe_id) VALUES('${user_id}',${recipe_id})`);
}

/**
 * Get watched recipes
 * @param {*} user_id 
 */
async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM watched_recipes WHERE user_id='${user_id}'`);
    return recipes_id;
}

/**
 * Create a recipe
 * @param {*} user_id 
 * @param {*} recipe
 */
async function createRecipe(user_id, recipe) {
    let {title, readyInMinutes, image, vegan, vegetarian, glutenFree, aggregateLikes, instructions, servings, extendedIngredients} = recipe;
    instructions = JSON.stringify(instructions);
    extendedIngredients = JSON.stringify(extendedIngredients);
    const recipe_id = recipe_id_sequence++;
    await DButils.execQuery(`INSERT INTO user_recipes VALUES('${user_id}','${recipe_id}','${image}','${title}','${readyInMinutes}','${vegan}','${vegetarian}','${glutenFree}','${aggregateLikes}','${instructions}','${servings}','${extendedIngredients}')`);    
    await markAsWatched(user_id, recipe_id);
}

/**
 * Get created recipes
 * @param {*} user_id 
 */
async function getCreatedRecipes(user_id) {
    const recipes = await DButils.execQuery(`SELECT * FROM user_recipes WHERE user_id='${user_id}'`);
    for (let i=0; i < recipes.length; i++) {
        recipes[i].instructions = JSON.parse(recipes[i].instructions);
        recipes[i].extendedIngredients = JSON.parse(recipes[i].extendedIngredients);
    }
    return recipes;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
exports.createRecipe = createRecipe;
exports.getCreatedRecipes = getCreatedRecipes;
