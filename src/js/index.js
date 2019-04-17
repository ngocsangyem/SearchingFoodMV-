// Global app controller

import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/** Global state
 * - Search object
 * - Curent recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
	// Get query
	const query = searchView.getInput;
	console.log(query);

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
		searchView.renderResults(state.search.result);
	}
};
elements.searchForm.addEventListener("submit", e => {
	e.preventDefault();
	controlSearch();
});
// console.log(state);
