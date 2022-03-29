import { gql } from 'graphql-request'

export default gql`
	mutation EmailConfirmation($confirmation: String!) {
		emailConfirmation(confirmation: $confirmation) {
			user {
				username
				confirmed
				blocked
				stripe_id
				id
			}
		}
	}
`
