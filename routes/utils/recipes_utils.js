const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require('./DButils');


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
        aggregateLikes: aggregateLikes,
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


const checkIsCreated = async (user_id, recipe_id) => {
    const createdRecipes = await DButils.execQuery(`SELECT * FROM user_recipes WHERE user_id='${user_id}' AND id='${recipe_id}'`);
    return createdRecipes.length;
}

/**
 * Get all recipe data
 * @param {*} recipe_id 
 */
async function getRecipeById(user_id, recipe_id) {
    const isCreated = await checkIsCreated(user_id, recipe_id);
    let recipe_info;
    if(isCreated) {
        recipe_info = await getCreatedRecipeById(recipe_id);
    } else {
        const res = await getRecipeInformation(recipe_id);
        recipe_info = res.data;
    }
    
    const { title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, extendedIngredients, instructions } = recipe_info;

    return {
        id: recipe_id,
        title,
        readyInMinutes,
        image,
        aggregateLikes,
        vegan,
        vegetarian,
        glutenFree,
        servings,
        extendedIngredients,
        instructions
    }
}

/**
 * Get all created recipe data
 * @param {*} recipe_id 
 */
async function getCreatedRecipeById(recipe_id) {
    return (await DButils.execQuery(`SELECT * FROM user_recipes WHERE id = ${recipe_id}`))[0];
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
async function search({query, number=5, cuisine, diet, intolerances}){
    const { data } = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
            query,
            number,
            cuisine,
            diet,
            intolerances
        }
    });
    const preview = await getRecipesPreview(data.results.map(({id}) => id));
    return preview;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeById = getRecipeById;
exports.getCreatedRecipeById = getCreatedRecipeById;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getRandomRecipes = getRandomRecipes;
exports.search = search;
