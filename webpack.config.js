const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'blocks/full-name/index': path.resolve(
			process.cwd(),
			'src/blocks/full-name/index.js',
		),
		'blocks/phone/index': path.resolve(
			process.cwd(),
			'src/blocks/phone/index.js',
		),
		'blocks/social-links/index': path.resolve(
			process.cwd(),
			'src/blocks/social-links/index.js',
		),
		'blocks/email/index': path.resolve(
			process.cwd(),
			'src/blocks/email/index.js',
		),
		'admin/index': path.resolve(process.cwd(), 'src/admin/index.js'),
		'editor/index': path.resolve(process.cwd(), 'src/editor/index.js'),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(process.cwd(), 'build'),
		filename: '[name].js',
	},
	plugins: [
		...defaultConfig.plugins,
		new RemoveEmptyScriptsPlugin({
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		}),
	],
};
