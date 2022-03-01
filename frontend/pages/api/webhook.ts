import { NextApiRequest, NextApiResponse } from 'next'
import getRawBody from 'raw-body'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY!, {
	apiVersion: '2020-08-27',
})

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
				const completedSession = event.data.object

				const sess = await stripe.checkout.sessions.retrieve(
					completedSession.id,
					{
						expand: ['line_items'],
					}
				)
				console.log(sess, sess.line_items?.data)

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
