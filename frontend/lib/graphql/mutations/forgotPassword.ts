import { gql } from 'graphql-request'

export default gql`
	mutation ForgotPassword($email: String!) {
		forgotPassword(email: $email) {
			ok
		}
	}
`
