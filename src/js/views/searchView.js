import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = "";
};

export const clearResults = () => {
	elements.searchResList.innerHTML = "";
	elements.searchResPages.innerHTML = "";
};

/**
 *
 * // 'Pasta with tomato and spinach'
 * acc: 0 / acc + cur.length = 5 / newTitle = ["Pasta"]
 * acc: 5 / acc + cur.length = 9 / newTitle = ["Pasta", "with"]
 * acc: 9 / acc + cur.length = 15 / newTitle = ["Pasta", "with", "tomato"]
 * acc: 15 / acc + cur.length = 18 / newTitle = ["Pasta", "with", "tomato"]
 */

const limitRecipeTitle = (title, limit = 17) => {
	let newTitle = [];
	if (title.length > limit) {
		title.split(" ").reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);
		// return result
		return `${newTitle.join(" ")} ...`;
	}
	return title;
};

const renderRecipe = recipe => {
	let markup = `
	<li>
		<a class="results__link" href="#${recipe.recipe_id}">
			<figure class="results__fig">
				<img src="${recipe.image_url}" alt="${recipe.title}">
			</figure>
			<div class="results__data">
				<h4 class="results__name">${limitRecipeTitle(recipe.title)}.</h4>
				<p class="results__author">${recipe.publisher}</p>
			</div>
		</a>
	</li>
	`;
	elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
		<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
			<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
			<svg class="search__icon">
				<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
			</svg>
		</button>
	`;

const renderButtons = (page, numResults, resPerPage) => {
	let pages = Math.ceil(numResults / resPerPage);
	let button;
	if (page === 1 && pages > 1) {
		// Only button to go to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		// Both button
		button = 
			`
				${createButton(page, 'prev')}
				${createButton(page, 'next')}
				
			`;
	} else if (page === pages && pages > 1) {
		// Only button to go to prev page
		button = createButton(page, 'prev');
	}
	console.log(`page: ${page}`);
	
	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	/**
		// Using slice method to calculate pages
		// pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		* page 1 = 0 / page 9 = 10
	 */
	 // Render result of current page
	let start = (page - 1) * resPerPage;
	let end = page * resPerPage;
	recipes.slice(start, end).forEach(renderRecipe);

	// Render pagnation
	renderButtons(page, recipes.length, resPerPage);
};
