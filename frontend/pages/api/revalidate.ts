import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check for secret to confirm this is a valid request

	if (req.method === 'POST') {
		if (req.headers.authorization !== process.env.REVALIDATE_TOKEN) {
			return res.status(401).json({ message: 'Invalid token' })
		}

		try {
			await res.unstable_revalidate('/')
			return res.json({ revalidated: true })
		} catch (err) {
			// If there was an error, Next.js will continue
			// to show the last successfully generated page
			return res.status(500).send('Error revalidating')
		}
	}
}
