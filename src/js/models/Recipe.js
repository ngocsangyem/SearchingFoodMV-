import axios from "axios";
import { key, proxy } from "../config";
export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	async getRecipe() {
		try {
			let res = await axios(
				`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${
					this.id
				}`
			);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (err) {
			console.log(err);
		}
	}

	calcTime() {
		// Assuming that we need 15 min for each 3 ingredients
		let numIng = this.ingredients.length;
		let periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings() {
		this.servings = 4;
	}

	parseIngredients() {
		let unitsLong = [
			"tablespoons",
			"tablespoon",
			"ounces",
			"ounce",
			"teaspoons",
			"teaspoon",
			"cups",
			"pounds"
		];
		let unitShort = [
			"tbsp",
			"tbsp",
			"oz",
			"oz",
			"tsp",
			"tsp",
			"cup",
			"pound"
		];

		let newIngredients = this.ingredients.map(el => {
			// Uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitShort[i]);
			});

			// Remove parenthese / remove ""
			ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

			// Parse ingredients into count, unit and ingredient
			let arrIng = ingredient.split(" ");
			let unitIndex = arrIng.findIndex(el2 => units.includes(el2));

			let objIng;
			if (unitIndex > -1) {
				// There is a unit
				// Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
				// Ex. 4 cups, arrCount is [4]
				let arrCount = arrIng.slice(0, unitIndex);

				let count;
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace("-", "+"));
				} else {
					count = eval(arrIng.slice(0, unitIndex).join("+"));
				}

				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(" ")
				};
			} else if (parseInt(arrIng[0], 10)) {
				// There is NO unit, but 1st element is number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: "",
					ingredient: arrIng.slice(1).join(" ")
				};
			} else if (unitIndex === -1) {
				// There is NO unit and NO number in 1st position
				objIng = {
					count: 1,
					unit: "",
					ingredient
				};
			}

			return objIng;
		});
	}
}