import axios from "axios";
// key: b6ebf05eeefcdca5274091997ac02b42
// search api: https://www.food2fork.com/api/search

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		let proxy = "https://cors-anywhere.herokuapp.com/";
		let key = "b6ebf05eeefcdca5274091997ac02b42";
		try {
			let res = await axios(
				`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${
					this.query
				}`
			);
			this.result = res.data.recipes;
			// console.log(this.result);
		} catch (err) {
			console.log(err);
		}
	}
}
