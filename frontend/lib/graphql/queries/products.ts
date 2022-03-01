import { gql } from 'graphql-request'

export default gql`
	query Products($ids: [String]) {
		products(filters: { sku: { in: $ids } }) {
			data {
				attributes {
					price
					name
					sku
					categories {
						data {
							attributes {
								name
							}
						}
					}
					description
					picture {
						data {
							attributes {
								url
								formats
							}
						}
					}
				}
			}
		}
	}
`
