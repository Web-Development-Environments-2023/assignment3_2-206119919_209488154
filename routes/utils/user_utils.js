const DButils = require("./DButils");

let recipe_id_sequence = 1;

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into Favorite_Recipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from Favorite_Recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`insert into Watched_Recipes values ('${user_id}',${recipe_id})`);
}

async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from Watched_Recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function createRecipe(user_id, recipe) {
    const {title, readyInMinutes, image, vegan, vegetarian, glutenFree, servings, extendedIngredients, instructions} = recipe;
    const recipe_id = recipe_id_sequence++;
    await DButils.execQuery(`INSERT INTO User_Recipes VALUES ('${user_id}','${recipe_id}','${title}','${readyInMinutes}','${image}','${vegan}','${vegetarian}','${glutenFree}','${servings}','${extendedIngredients}')`);
    
    instructions.forEach(async (instruction, index) => {
        await DButils.execQuery(`INSERT INTO Recipe_Instructions VALUE ('${index + 1}', '${instruction}', '${recipe_id}')`);        
    });
}

async function getCreatedRecipes(user_id) {
    const recipes = await DButils.execQuery(`select * from User_Recipes where user_id='${user_id}'`);
    
    recipes.forEach(async recipe => {
        recipe.instructions = await DButils.execQuery(`SELECT * FROM Recipe_Instructions WHERE recipe_id = '${recipe.recipe_id}'`);
    });

    return recipes;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
exports.createRecipe = createRecipe;
exports.getCreatedRecipes = getCreatedRecipes;
