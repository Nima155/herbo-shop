import { gql } from 'graphql-request'

export default gql`
	query {
		me {
			username
			confirmed
			blocked
			stripe_id
			id
		}
	}
`
