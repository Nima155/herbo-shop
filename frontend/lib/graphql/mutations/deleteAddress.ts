import { gql } from 'graphql-request'

export default gql`
	mutation DeleteAddress($id: ID!) {
		deleteAddress(id: $id) {
			data {
				id
			}
		}
	}
`
