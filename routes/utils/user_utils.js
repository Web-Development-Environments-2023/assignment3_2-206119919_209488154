const DButils = require("./DButils");

let recipe_id_sequence = 1;

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO favorite_recipes VALUES('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favorite_recipes WHERE user_id='${user_id}'`);
    return recipes_id;
}

async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO watched_recipes(user_id,recipe_id) VALUES('${user_id}',${recipe_id})`);
}

async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM watched_recipes WHERE user_id='${user_id}'`);
    return recipes_id;
}

async function createRecipe(user_id, recipe) {
    const {title, readyInMinutes, image, vegan, vegetarian, glutenFree, aggregateLikes, instructions, servings, extendedIngredients} = recipe;
    const recipe_id = recipe_id_sequence++;
    await DButils.execQuery(`INSERT INTO user_recipes VALUES('${user_id}','${recipe_id}','${image}','${title}','${readyInMinutes}','${vegan}','${vegetarian}','${glutenFree}','${aggregateLikes}','${instructions}','${servings}','${extendedIngredients}')`);    
    // instructions.forEach(async (instruction, index) => {
    //     await DButils.execQuery(`INSERT INTO recipe_unstructions VALUE('${index + 1}','${instruction}','${recipe_id}')`);        
    // });
}

async function getCreatedRecipes(user_id) {
    const recipes = await DButils.execQuery(`SELECT * FROM user_recipes WHERE user_id='${user_id}'`);
    
    // recipes.forEach(async recipe => {
    //     recipe.instructions = await DButils.execQuery(`SELECT * FROM recipe_instructions WHERE recipe_id = '${recipe.recipe_id}'`);
    // });

    return recipes;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
exports.createRecipe = createRecipe;
exports.getCreatedRecipes = getCreatedRecipes;
