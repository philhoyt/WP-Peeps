const { FlatCompat } = require( '@eslint/eslintrc' );
const path = require( 'path' );

const compat = new FlatCompat( {
	baseDirectory: __dirname,
	resolvePluginsRelativeTo: path.resolve( __dirname, 'node_modules' ),
} );

module.exports = [
	{
		ignores: [ 'build/**', 'vendor/**', 'node_modules/**' ],
	},
	...compat.extends( 'plugin:@wordpress/eslint-plugin/recommended' ),
	{
		rules: {
			'prettier/prettier': 'off',
		},
	},
	{
		files: [ '**/__tests__/**/*.js', '**/*.test.js' ],
		languageOptions: {
			globals: {
				describe: 'readonly',
				it: 'readonly',
				test: 'readonly',
				expect: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				jest: 'readonly',
			},
		},
	},
];
