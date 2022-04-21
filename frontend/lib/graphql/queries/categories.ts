import { gql } from 'graphql-request'

export default gql`
	query {
		categories {
			data {
				id
				attributes {
					name
				}
			}
		}
	}
`
