// Global app controller

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/** Global state
 * - Search object
 * - Curent recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
	// Get query
	const query = searchView.getInput;

	if (query) {
		// New search object add to state
		state.search = new Search(query);

		// Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		//Loader run
		renderLoader(elements.searchRes);
		// Search for recipes
		await state.search.getResults();

		// Render results on UI
		clearLoader();
		console.log(state.search.result);
		searchView.renderResults(state.search.result);
	}
};
elements.searchForm.addEventListener("submit", e => {
	e.preventDefault();
	controlSearch();
});
// console.log(state);

elements.searchResPages.addEventListener("click", e => {
	let btn = e.target.closest(".btn-inline");
	if (btn) {
		let goToPage = parseInt(btn.dataset.goto, 10); // 0 -> 9;
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
		console.log(goToPage);
	}
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
	// Get Id from url
	let id = window.location.hash.replace("#", "");
	console.log(id);

	if (id) {
		// Prepare UI for changes

		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (err) {
			console.log(err);
			alert("Error processing recipe!");
		}
	}
};
