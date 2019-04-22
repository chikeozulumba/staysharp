
const webpack = require('webpack');
const path = require('path');
const {
	VueLoaderPlugin,
} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: ['babel-polyfill', './src/app.js'],
	output: {
		path: path.resolve(__dirname, '../www'),
	},
	devServer: {
		hot: true,
		watchOptions: {
			poll: true,
		},
	},
	module: {
		rules: [{
			test: /\.vue$/,
			use: 'vue-loader',
		}, {
			test: /\.css$/,
			use: [
				'vue-style-loader',
				'css-loader',
			],
		}, {
			test: /\.scss$/,
			use: [
				'node-sass',
				'sass-loader',
			],
		}, {
			test: /\.js$/,
			use: 'babel-loader',
		}, {
			test: /\.(png|woff|woff2|eot|ttf|svg)$/,
			loader: 'url-loader?limit=100000',
		}],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './public/index.html',
			inject: true,
		}),
	],
};
