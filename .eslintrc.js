/**
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
		'prettier',
	],
	env: {
		node: true,
		es2020: true,
		jest: true,
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'n8n-nodes-base/node-dirname-against-convention': 'off',
		'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
		'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
		'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};
