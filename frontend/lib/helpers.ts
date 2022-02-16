import { GraphQLClient } from 'graphql-request'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export function authenticatedGraphQl(
	cookies?: NextApiRequestCookies
): GraphQLClient {
	const cookieValues: string[] = Object.values(cookies || [])

	const graphClient = new GraphQLClient(
		process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
		{
			credentials: 'include',
			mode: 'cors',
			...(cookies && {
				headers: {
					Cookie: Object.keys(cookies)
						.map((k, i) => `${k}=${cookieValues[i]};`)
						.join(' '),
				},
			}),
		}
	)
	return graphClient
}
