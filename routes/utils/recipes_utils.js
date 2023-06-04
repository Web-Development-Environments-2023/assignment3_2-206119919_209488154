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

/**
 * Get recipe and extract the relevant recipe data for preview
 * @param {*} recipe_id 
 */
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

/**
 * Get recipes and extract the relevant recipes data for preview
 * @param {*} recipes_id_array 
 */
async function getRecipesPreview(recipes_id_array) {
    let preview_array =[];
    for (let i = 0; i < recipes_id_array.length; i++) {
        preview_array.push(await getRecipeDetails(recipes_id_array[i]))
    }
    return preview_array;
}

/**
 * Get all recipe data
 * @param {*} recipe_id 
 */
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

/**
 * Get all family recipes
 */
async function getFamilyRecipes(){
    const recipes = await DButils.execQuery(`SELECT * FROM family_recipes`);
    return recipes;
}

/**
 * Get 3 random recipes and extract the relevant recipe data for preview
 */
async function getRandomRecipes(){
    const {data: {recipes}} = await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });

    const randomIds = recipes.map(({id}) => id);
    return getRecipesPreview(randomIds);
}

/**
 * Get 3 random recipes and extract the relevant recipe data for preview
 * @param {*} query
 * @param {*} number
 * @param {*} cuisine
 * @param {*} diet
 * @param {*} intolerance
 */
async function search({query, number=5, cuisine, diet, intolerance}){
    const { data } = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
            query,
            number,
            cuisine,
            diet,
            intolerance
        }
    });
    const preview = await getRecipesPreview(data.results.map(({id}) => id));
    return preview;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeById = getRecipeById;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getRandomRecipes = getRandomRecipes;
exports.search = search;
