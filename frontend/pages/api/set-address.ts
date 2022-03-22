import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY!, {
	apiVersion: '2020-08-27',
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check for secret to confirm this is a valid request
	stripe.customers.update('1321', { shipping: { address: {} } })

	if (req.method === 'POST') {
		// stripe.customers.update()
	}
}
