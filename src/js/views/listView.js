import { elements } from "./base";

export const renderItem = item => {
	let markup = `
		<li class="shopping__item" data-id="${item.id}">
			<div class="shopping__count">
				<input type="number" value="${item.count}" step="${
		item.count
	}" class="shopping__count-value">
				<p>${item.unit}</p>
			</div>
			<p class="shopping__description">${item.ingredient}</p>
			<button class="shopping__delete btn-tiny">
				<svg>
					<use href="img/icons.svg#icon-circle-with-cross"></use>
				</svg>
			</button>
		</li>
	`;

	elements.shopping.insertAdjacentHTML("beforeend", markup);
};

export const deleteItem = id => {
	let item = document.querySelector(`[data-id="${id}"]`);

	if (item) item.parentElement.removeChild(item);
};
