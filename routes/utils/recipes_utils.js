const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
    }
}

async function getRecipesPreview(recipes_id_array) {
    let preview_array =[];
    for (let i = 0; i < recipes_id_array.length; i++) {
        preview_array.push(await getRecipeDetails(recipes_id_array[i]))
    }
    return preview_array;
}

async function getRecipeById(recipe_id) {
    const recipe_info = await getRecipeInformation(recipe_id);
    const { title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, extendedIngredients, instructions } = recipe_info.data;

    return {
        id: recipe_id,
        title,
        readyInMinutes,
        image,
        popularity,
        vegan,
        vegetarian,
        glutenFree,
        servings,
        extendedIngredients,
        instructions
    }
}

async function getFamilyRecipes(){
    const recipes = await DButils.execQuery(`select * from Family_Recipes`);
    return recipes;
}


exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeById = getRecipeById;
exports.getFamilyRecipes = getFamilyRecipes;
