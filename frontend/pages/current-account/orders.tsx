import { GetServerSideProps } from 'next'
import { QueryClient, dehydrate } from 'react-query'
import queries from '../../lib/graphql'
import { authenticatedGraphQl } from '../../lib/helpers'
export default function Orders() {
	return
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	await queryClient.prefetchQuery('user_stats', async () => {
		return gqlClient.request(USER_INFO)
	})

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	}
}
