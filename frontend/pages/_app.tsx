import '../styles/globals.css'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { useState } from 'react'
import { CartProvider } from 'use-shopping-cart/react'

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<CartProvider
			cartMode="checkout-session"
			stripe={process.env.NEXT_PUBLIC_STRIPE_KEY!}
			// successUrl="http://localhost:3000/"
			// cancelUrl="http://localhost:3000/current-account/cart"
			currency="USD"
			// allowedCountries={['US', 'GB', 'CA']}
			// billingAddressCollection={true}
		>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<Component {...pageProps} />
				</Hydrate>
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</QueryClientProvider>
		</CartProvider>
	)
}

export default MyApp
