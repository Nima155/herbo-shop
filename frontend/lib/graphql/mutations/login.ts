import { gql } from 'graphql-request'

export default gql`
	mutation Login($identifier: String!, $password: String!) {
		login(input: { identifier: $identifier, password: $password }) {
			user
		}
	}
`
