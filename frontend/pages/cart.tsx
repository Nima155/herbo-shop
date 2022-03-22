import { GetServerSideProps } from 'next'
import React from 'react'
import { AnimatePresence, LayoutGroup, Reorder, motion } from 'framer-motion'
import { dehydrate, QueryClient } from 'react-query'
import { useShoppingCart } from 'use-shopping-cart/react'
import Layout from '../components/Layout'
import { authenticatedGraphQl } from '../lib/helpers'
import useUser from '../lib/useUser'
import queries from '../lib/graphql'
import Button from '../components/Button'
import SubmitButton from '../components/Input/SubmitButton'
import CartItem from '../components/CartItem'

export default function Cart() {
	const {
		cartDetails,
		clearCart,
		redirectToCheckout,
		formattedTotalPrice,
		cartCount,
	} = useShoppingCart()
	const { user } = useUser()

	return (
		<Layout>
			<div className="flex gap-2 justify-between mt-4">
				<div className="flex flex-col p-2 flex-grow mb-20">
					<AnimatePresence initial={false} exitBeforeEnter>
						<LayoutGroup>
							{Object.values(cartDetails).map((e: any) => (
								<CartItem key={e.id} productId={e.id} />
							))}
						</LayoutGroup>
					</AnimatePresence>
				</div>
				<div className="flex gap-2 fixed bottom-0 p-2 bg-slate-100 w-full justify-between left-0 border-t-slate-300 border-t sm:sticky sm:top-5 sm:w-auto sm:border-t-0 sm:self-start sm:flex-col sm:rounded-lg sm:shadow-lg sm:p-4">
					<div className="flex flex-col">
						<p className="text-sm text-slate-600">Total Price:</p>
						<p className="text-center font-semibold text-slate-700">
							{formattedTotalPrice}
						</p>
					</div>
					<div className="flex flex-col gap-1">
						<SubmitButton
							onClick={async () => {
								if (cartCount === 0) {
									return
								}
								const { id } = await (
									await fetch('/api/create-checkout-session', {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											...cartDetails,
											stripeId: user.me.stripe_id,
										}),
									})
								).json()
								await redirectToCheckout({ sessionId: id })
							}}
							className="self-stretch rounded-sm"
						>
							Checkout
						</SubmitButton>
						<Button
							onClick={() => clearCart()}
							type="button"
							className="bg-slate-500 hover:bg-slate-700 self-stretch text-gray-100 transition-colors py-1 px-7 duration-150 ease-in rounded-sm"
						>
							Clear
						</Button>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	await queryClient.prefetchQuery('user_stats', async () => {
		const data_1 = gqlClient.request(USER_INFO)
		return data_1
	})

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	}
}
