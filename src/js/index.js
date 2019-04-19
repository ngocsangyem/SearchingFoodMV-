// Global app controller

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likeView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
/** Global state
 * - Search object
 * - Curent recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.state = state;
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
		// console.log(state.search.result);
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
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// Highlight selected search item
		if (state.search) searchView.highlightSelected(id);

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

["hashchange", "load"].forEach(event =>
	window.addEventListener(event, controlRecipe)
);

/**
 * List CONTROLLER
 */
const controlList = () => {
	// Create a new List if there in none yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the list
	state.recipe.ingredients.forEach(el => {
		let item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// Handle delete and update list item
elements.shopping.addEventListener("click", e => {
	let id = e.target.closest(".shopping__item").dataset.id;

	// Handle delete button
	if (e.target.matches(".shopping__delete, .shopping__delete *")) {
		// Delete from state
		state.list.deleteItem(id);

		// Delete from UI
		listView.deleteItem(id);
		// Handle count update
	} else if (e.target.matches(".shopping__count-value")) {
		let val = parseFloat(e.target.value);
		state.list.updateCount(id, val);
	}
});

/**
 * Like CONTROLLER
 */
// testing
state.likes = new Likes();
likeView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	let currentID = state.recipe.id;

	//User has Not yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		let newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);

		// Toggle the like button
		likeView.toggleLikeBtn(true);

		// Add like to UI list
		likeView.renderLike(newLike);

		// User has liked current recipe
	} else {
		// Remove like from state
		state.likes.deleteLike(currentID);

		// Toggle the like button
		likeView.toggleLikeBtn(false);

		// Remove like from UI list
		likeView.deleteLike(currentID);
	}
	likeView.toggleLikeMenu(state.likes.getNumLikes());
};

// Handling recipe button clicks
elements.recipe.addEventListener("click", e => {
	if (e.target.matches(".btn-decrease, .btn-decrease *")) {
		// Clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}
	}
	if (e.target.matches(".btn-increase, .btn-increase *")) {
		// Clicked
		state.recipe.updateServings("inc");
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
		// Add ingredient to shopping list
		controlList();
	} else if (e.target.matches(".recipe__love, .recipe__love *")) {
		// Like controllder
		controlLike();
	}
	// console.log(state.recipe);
});
