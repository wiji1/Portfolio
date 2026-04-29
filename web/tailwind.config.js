export default {
	content: [ /* ... */ ],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'custom-test': '#66ffcc',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
