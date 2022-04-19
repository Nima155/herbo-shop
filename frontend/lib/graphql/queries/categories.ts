import { gql } from 'graphql-request'

export default gql`
	query {
		categories {
			data {
				attributes {
					name
				}
			}
		}
	}
`
