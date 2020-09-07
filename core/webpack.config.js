/* webpack.config.js */
const path = require('path');
const helpers = require('./helpers');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
	return {
		context: path.resolve(__dirname, '../src'),
		entry: ['./js/app.js', './scss/app.scss'],
		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: './js/[name].min.js',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: [
								'@babel/plugin-proposal-class-properties',
							],
						},
					},
				},
				{
					test: /\.pug$/,
					use: ['pug-loader'],
				},
				{
					test: /\.s[ac]ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								plugins: [
									require('postcss-cssnext')({
										cascade: false,
									}),
								],
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
							},
						},
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 3000,
						name: 'assets/images/[name].[ext]',
					},
				},
				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 5000,
						name: 'assets/fonts/[name].[ext]',
					},
				},
				{
					test: /\.(mp4)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'assets/videos/[name].[ext]',
					},
				},
			],
		},
		plugins: [
			helpers.vendor(),
			...helpers.copy(argv.mode),
			...helpers.pages(env.NODE_ENV),
			new MiniCssExtractPlugin({
				filename: './css/[name].min.css',
			}),
		],
		devtool: 'source-map',
		devServer: {
			port: 8000,
			contentBase: path.join(__dirname, '../dist'),
			compress: true,
		},
	};
};
