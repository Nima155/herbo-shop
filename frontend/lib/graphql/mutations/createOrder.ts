import { gql } from 'graphql-request'

export default gql`
	mutation CreateOrder($data: OrderInput!) {
		createOrder(data: $data) {
			data {
				id
			}
		}
	}
`
