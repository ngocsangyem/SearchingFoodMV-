const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	entry: ["babel-polyfill", "./src/js/index.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/bundle.js"
	},
	devServer: {
		contentBase: "./dist",
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/index.html"
		})
	]
};
