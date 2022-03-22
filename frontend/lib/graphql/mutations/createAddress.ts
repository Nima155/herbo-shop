import { gql } from 'graphql-request'

export default gql`
	mutation CreateAddress($address: AddressInput!) {
		createAddress(data: $address) {
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

					state
					is_shipping
				}
			}
		}
	}
`
