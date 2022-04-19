import { GetServerSideProps } from 'next'
import { QueryClient, dehydrate } from 'react-query'
import Layout from '../../components/Layout'
import Order from '../../components/Order'
import queries from '../../lib/graphql'
import { authenticatedGraphQl } from '../../lib/helpers'

export default function Orders({ orders }: { orders: any }) {
	const { meta, data } = orders.orders

	return (
		<Layout>
			<section className="flex flex-col">
				{data.map((e, i) => (
					<Order key={i} order={e} />
				))}
			</section>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO, ORDERS } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	const statsPromise = queryClient.prefetchQuery('user_stats', async () => {
		return gqlClient.request(USER_INFO)
	})

	// gqlClient.request(PRODUCTS)
	const ordersRequest = gqlClient.request(ORDERS)

	const [orders, _] = await Promise.all([ordersRequest, statsPromise])

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			orders,
		},
	}
}
