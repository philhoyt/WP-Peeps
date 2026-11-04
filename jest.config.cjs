/**
 * Jest configuration.
 *
 * `@wordpress/scripts` 37 runs Vitest from `test-unit-js`; this project keeps
 * its Jest suite through `wp-scripts test-unit-jest`, which no longer ships
 * the WordPress defaults, so they are set here. See
 * https://github.com/WordPress/gutenberg/blob/HEAD/packages/scripts/docs/vitest-migration.md#keep-an-existing-jest-suite
 */
module.exports = {
	preset: '@wordpress/jest-preset-default',
	transform: {
		'\\.[jt]sx?$': [
			'babel-jest',
			{ presets: [ '@wordpress/babel-preset-default' ] },
		],
	},
};
