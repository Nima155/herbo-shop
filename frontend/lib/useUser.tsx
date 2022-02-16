import { useEffect } from 'react'
import Router from 'next/router'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import queries from './graphql'
const { userInfo, login } = queries
import { GraphQLClient, gql, request } from 'graphql-request'
const gqlClient = new GraphQLClient(
	process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
	{
		credentials: 'include',
		mode: 'cors',
	}
)
// async function main() {
//   const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

export default function useUser({
	redirectTo = '',
	redirectIfFound = false,
} = {}) {
	const queryClient = useQueryClient()

	const { data: user } = useQuery(
		'user_stats',
		async () => {
			const data_1 = await gqlClient.request(userInfo)

			return data_1
		},
		{
			staleTime: 10000,
		}
	)

	const loginUser = useMutation(
		async (credentials: { identifier: string; password: string }) => {
			return gqlClient.request(login, credentials, {
				'x-xsrf-token': user._csrf,
			})
		},
		{
			onSuccess: (userInf) => {
				queryClient.setQueryData('user_stats', { me: userInf.login.user })
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
