import { gql } from 'graphql-request'

export default gql`
	mutation CreateOrderLists($data: [OrderListInput!]!) {
		createOrderLists(data: $data) {
			count
		}
	}
`
