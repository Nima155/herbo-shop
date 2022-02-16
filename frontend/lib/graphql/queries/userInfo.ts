import { gql } from 'graphql-request'

export default gql`
	query {
		_csrf
		me {
			username
			confirmed
			blocked
		}
	}
`
