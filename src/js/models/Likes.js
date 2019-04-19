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
		return like;
	}

	deleteLike(id) {
		let index = this.likes.findIndex(el => el.id === id);
		this.likes.splice(index, 1);
	}

	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1;
	}

	getNumLikes() {
		return this.likes.length;
	}
}
