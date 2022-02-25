import { gql } from 'graphql-request'

export default gql`
	query {
		products {
			data {
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
