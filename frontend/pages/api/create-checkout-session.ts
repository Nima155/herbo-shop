import { NextApiRequest, NextApiResponse } from 'next'
import request from 'graphql-request'
import queries from '../../lib/graphql'
import { ProductAttributes } from '../../lib/types'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY!, {
	apiVersion: '2020-08-27',
})
const validateCartItems =
	require('use-shopping-cart/utilities').validateCartItems

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check for secret to confirm this is a valid request

	if (req.method === 'POST') {
		const { stripeId, userId, ...rest } = req.body

		// if (stripeId)
		const databaseItems: {
			products: { data: [{ attributes: ProductAttributes; id: string }] }
		} = await request(
			process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
			queries.PRODUCTS,
			{
				ids: Object.values(rest).map((e: any) => e.id),
			}
		)

		// console.log(
		// 	databaseItems.products.data.map((e) => {
		// 		return { ...e.attributes, currency: 'USD' }
		// 	})
		// )

		const line_items = validateCartItems(
			databaseItems.products.data.map((e) => {
				return { ...e.attributes, currency: 'USD', id: e.id }
			}),
			rest
		)

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			billing_address_collection: 'required',
			shipping_address_collection: {
				allowed_countries: ['US', 'CA'],
			},
			customer: stripeId,
			shipping_options: [
				{
					shipping_rate_data: {
						display_name: 'Iran Post',
						type: 'fixed_amount',
						delivery_estimate: {
							maximum: { unit: 'week', value: 3 },
							minimum: { unit: 'week', value: 2 },
						},
						fixed_amount: {
							amount: 2000,
							currency: 'USD',
						},
					},
				},
			],
			metadata: {
				userId,
			},
			mode: 'payment',
			/*
			 * This env var is set by Netlify and inserts the live site URL. If you want
			 * to use a different URL, you can hard-code it here or check out the
			 * other environment variables Netlify exposes:
			 * https://docs.netlify.com/configure-builds/environment-variables/
			 */
			success_url: `http://localhost:3000/`,
			cancel_url: 'http://localhost:3000/',
			line_items,
		})

		res.json({
			id: session.id,
		})
	}
}
