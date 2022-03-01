import { gql } from 'graphql-request'

export default gql`
	mutation {
		createOrder(
			data: {
				shipping_address: "hello"
				billing_address: "hello"
				status: processing
				total_cost: 2000
			}
		) {
			data {
				attributes {
					shipping_address
				}
			}
		}
	}
`
