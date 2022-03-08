import '../styles/globals.css'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { useState } from 'react'
import { CartProvider } from 'use-shopping-cart/react'
import Header from '../components/Header'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React from 'react'

function MyApp({ Component, pageProps, router }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())
	console.log(router.route)

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
					<Header />

					<AnimatePresence
						exitBeforeEnter={true}
						initial={false}
						onExitComplete={() => {
							window.scrollTo(0, 0)
						}}
					>
						<Component {...pageProps} key={router.route} />
					</AnimatePresence>
				</Hydrate>
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</QueryClientProvider>
		</CartProvider>
	)
}

export default MyApp
