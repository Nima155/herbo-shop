import { gql } from 'graphql-request'

export default gql`
	query Products($ids: [ID]) {
		products(filters: { id: { in: $ids } }) {
			data {
				id
				attributes {
					price
					name
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
