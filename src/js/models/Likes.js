export default class Likes {
	constructor() {
		this.likes = [];
	}

	addLike(id, title, author, img) {
		let like = {
			id,
			title,
			author,
			img
		};
		this.likes.push(like);

		// Perist data in localStrorgae
		this.persistData();

		return like;
	}

	deleteLike(id) {
		let index = this.likes.findIndex(el => el.id === id);
		this.likes.splice(index, 1);

		// Perist data in localStrorgae
		this.persistData();
	}

	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1;
	}

	getNumLikes() {
		return this.likes.length;
	}

	persistData() {
		localStorage.setItem("likes", JSON.stringify(this.likes));
	}

	readStorage() {
		let storage = JSON.parse(localStorage.getItem("likes"));

		// Restoring likes from the localStorage
		if (storage) this.likes = storage;
	}
}
