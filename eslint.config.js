const wpPlugin = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [
			'build/**',
			'lib/**',
			'vendor/**',
			'node_modules/**',
			'.claude/**',
		],
	},
	...wpPlugin.configs.recommended,
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
