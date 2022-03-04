import { gql } from 'graphql-request'

export default gql`
	mutation Register(
		$username: String!
		$email: String!
		$password: String!
		$stripeId: String!
	) {
		register(
			input: {
				username: $username
				password: $password
				email: $email
				stripe_id: $stripeId
			}
		) {
			user {
				username
			}
		}
	}
`
