import '../styles/globals.css'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { useState } from 'react'
import { CartProvider } from 'use-shopping-cart/react'
import Header from '../components/Header'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import Toast, { useToastStore } from '../components/ToastNotifications'
import ReactDOM from 'react-dom'

function MyApp({ Component, pageProps, router }: AppProps) {
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
					<Header />
					<NotificationContainer />

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
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</CartProvider>
	)
}

function NotificationContainer() {
	const { toasts } = useToastStore()
	return ReactDOM.createPortal(
		<LayoutGroup>
			<motion.ul className="fixed sm:right-0 sm:bottom-0 flex flex-col justify-end gap-2 p-8 top-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:top-auto">
				<AnimatePresence initial={false}>
					{/* <LayoutGroup> */}
					{toasts.map((e) => (
						<Toast key={e.id} id={e.id} options={{ status: e.typ }}>
							<p>{e.message}</p>
						</Toast>
					))}
					{/* </LayoutGroup> */}
				</AnimatePresence>
			</motion.ul>
		</LayoutGroup>,
		document.getElementById('toastContainer')!
	)
}

export default MyApp
