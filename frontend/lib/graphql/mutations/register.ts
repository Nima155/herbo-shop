import { gql } from 'graphql-request'

export default gql`
	mutation Register($username: String!, $email: String!, $password: String!) {
		register(
			input: { username: $username, password: $password, email: $email }
		) {
			user {
				username
			}
		}
	}
`
