import { NextApiResponse } from 'next'
import ApiError from './ApiError'
export default function apiErrorHandler(
	err: Error | ApiError,
	res: NextApiResponse
) {
	if (err instanceof ApiError) {
		return res.status(err.status).json({ error: err.message })
	}
	return res.status(500).json({ message: 'something went wrong!' })
}
