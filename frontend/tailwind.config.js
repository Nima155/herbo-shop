module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			gridTemplateColumns: {
				// Simple 16 column grid
				'responsive-cols': 'repeat(auto-fill, minmax(264px, 386px))',
			},
		},
	},
	plugins: [],
}
