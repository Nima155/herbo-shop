import { gql } from 'graphql-request'

export default gql`
	mutation UpdateAddress($address: AddressInput!, $id: ID!) {
		updateAddress(data: $address, id: $id) {
			data {
				id
				attributes {
					address_1
					city
					country
					zip_code
					phone_number
					first_name
					last_name
					is_billing
					state
					is_shipping
				}
			}
		}
	}
`
