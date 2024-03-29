export const elements = {
	searchForm: document.querySelector(".search"),
	searchInput: document.querySelector(".search__field"),
	searchResList: document.querySelector(".results__list"),
	searchRes: document.querySelector(".results"),
	searchResPages: document.querySelector(".results__pages"),
	recipe: document.querySelector(".recipe"),
	shopping: document.querySelector(".shopping__list"),
	likeMenu: document.querySelector(".likes__field"),
	likeList: document.querySelector(".likes__list")
};

export const elementStrings = {
	loader: "loader"
};

export const renderLoader = parent => {
	let loader = `
		<div class="${elementStrings.loader}">
			<svg>
				<use href="img/icons.svg#icon-cw"></use>
			</svg>
		</div>
	`;
	parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
	let loader = document.querySelector(`.${elementStrings.loader}`);
	if (loader) loader.parentElement.removeChild(loader);
};
