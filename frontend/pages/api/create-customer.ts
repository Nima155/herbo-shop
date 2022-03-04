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
	const { email } = req.body

	if (req.method === 'POST') {
		const customer = await stripe.customers.create({ email: email })
		return res.json({ id: customer.id })
	}
	return res.status(400).json({ error: 'Invalid request method' })
}
