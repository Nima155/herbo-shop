import React from 'react'
import { useShoppingCart } from 'use-shopping-cart/react'
import Layout from '../components/Layout'
import useUser from '../lib/useUser'

export default function Cart() {
	const { cartDetails, clearCart, redirectToCheckout } = useShoppingCart()

	return (
		<Layout>
			<div className="flex gap-5">
				<button
					onClick={async () => {
						const { id } = await (
							await fetch('/api/create-checkout-session', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(cartDetails),
							})
						).json()
						await redirectToCheckout({ sessionId: id })
					}}
				>
					Checkout
				</button>
				<button onClick={() => clearCart()}>clear</button>
			</div>
		</Layout>
	)
}
