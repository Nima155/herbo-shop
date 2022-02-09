import { useEffect } from 'react'
import Router from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { request } from 'graphql-request'
import queries from './graphql'
const { userInfo, login } = queries

export default function useUser({
	redirectTo = '',
	redirectIfFound = false,
} = {}) {
	const queryClient = useQueryClient()

	const { data: user } = useQuery('user_stats', async () => {
		const data_1 = await request(
			process.env.BACKEND_URL_GRAPHQL as string,
			userInfo
		)

		return data_1
	})

	const loginUser = useMutation(
		async (credentials) => {
			return await request(
				process.env.BACKEND_URL_GRAPHQL as string,
				login,
				credentials
			)
		},
		{
			onSuccess: (userInf) => {
				queryClient.setQueryData('user_stats', userInf)
			},
		}
	)

	useEffect(() => {
		// if no redirect needed, just return (example: already on /dashboard)
		// if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
		if (!redirectTo || !user.errors) return

		if (
			// If redirectTo is set, redirect if the user was not found.
			(redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
			// If redirectIfFound is also set, redirect if the user was found
			(redirectIfFound && user?.isLoggedIn)
		) {
			Router.push(redirectTo)
		}
	}, [user, redirectIfFound, redirectTo])

	return { user, loginUser }
}
