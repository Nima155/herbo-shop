/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: '/pages/:path*',
	// 			destination: 'http://localhost:3000/pages/:path*', // Proxy to Backend
	// 		},
	// 	]
	// },
	experimental: {
		styledComponents: true,
	},
}

module.exports = nextConfig
