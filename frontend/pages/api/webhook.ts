import { NextApiRequest, NextApiResponse } from 'next'
import getRawBody from 'raw-body'
import queries from '../../lib/graphql'
import Stripe from 'stripe'
import request from 'graphql-request'
const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY!, {
	apiVersion: '2020-08-27',
})

const { CREATE_ORDER, CREATE_ORDER_LISTS } = queries

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const sig = req.headers['stripe-signature']

		let event

		const rawBody = await getRawBody(req)

		try {
			event = stripe.webhooks.constructEvent(
				rawBody,
				sig!,
				process.env.WEBHOOK_SECRET!
			)
		} catch (err: any) {
			return res.status(400).send(`Webhook Error: ${err.message}`)
		}

		// Handle the event
		switch (event?.type) {
			case 'payment_intent.succeeded':
				const paymentIntent = event.data.object

				break
			case 'payment_method.attached':
				const paymentMethod = event.data.object
				console.log('PaymentMethod was attached to a Customer!')
				break
			// ... handle other event types
			case 'checkout.session.completed':
				const completedSession: any = event.data.object

				const sess = await stripe.checkout.sessions.retrieve(
					completedSession.id,
					{
						expand: ['line_items', 'line_items.data.price.product'],
					}
				)
				console.log({
					data: {
						user: sess.metadata?.userId,
						status: 'processing',
						total_cost: sess.amount_total! / 100,
					},
				})

				const order = await request(
					process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
					CREATE_ORDER,
					{
						data: {
							user: sess.metadata?.userId,
							status: 'processing',
							total_cost: sess.amount_total! / 100,
						},
					}
				)

				// console.log(order.createOrder.data.id) // order id
				await request(
					process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
					CREATE_ORDER_LISTS,
					{
						data: sess.line_items?.data.map(({ price, quantity }) => ({
							quantity,
							product: (price?.product as Stripe.Product).metadata.id,
							order: order.createOrder.data.id,
						})),
					}
				)
				// console.log(
				// 	await stripe.products.list()
				// 	// 	sess.line_items?.data.map((prod) => prod.price?.product as string)
				// )

				// console.log(sess, 'heyyyy there')
				// console.log(mappedProducts)

				break

			default:
				console.log(`Unhandled event type ${event?.type}`)
		}

		// Return a response to acknowledge receipt of the event
		res.json({ received: true })
	}
	res.status(400).json({ error: 'Method not allowed!' })
}

export const config = {
	api: {
		bodyParser: false,
	},
}
