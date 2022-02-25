import { GraphQLClient } from 'graphql-request'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { ImageLoaderProps } from 'next/image'
export function serializeCookies(
	cookies?: NextApiRequestCookies
): string | null {
	const cookieValues: string[] = Object.values(cookies || [])

	return cookies
		? Object.keys(cookies)
				.map((k, i) => `${k}=${cookieValues[i]};`)
				.join(' ')
		: null
}

export function authenticatedGraphQl(
	cookies?: NextApiRequestCookies
): GraphQLClient {
	const cookies_1 = serializeCookies(cookies)

	const graphClient = new GraphQLClient(
		process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
		{
			credentials: 'include',
			mode: 'cors',
			...(cookies && {
				headers: {
					Cookie: cookies_1!,
				},
			}),
		}
	)
	return graphClient
}

export function imageLoader(resourceLocation: ImageLoaderProps) {
	// console.log(
	// 	`${process.env.NEXT_PUBLIC_IMAGE_URL}/${resourceLocation.width}_${resourceLocation.src}`
	// )

	return `${process.env.NEXT_PUBLIC_IMAGE_URL}${resourceLocation.src}`
}
