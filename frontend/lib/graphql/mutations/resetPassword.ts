import { gql } from 'graphql-request'

export default gql`
	mutation ResetPassword(
		$password: String!
		$passwordConfirmation: String!
		$code: String!
	) {
		resetPassword(
			password: $password
			passwordConfirmation: $passwordConfirmation
			code: $code
		) {
			user {
				username
			}
		}
	}
`
