import { gql } from 'graphql-request'

export default gql`
	query {
		me {
			addresses {
				id
				attributes {
					city
					address_1
					zip_code
					country
					first_name
					last_name

					state
					phone_number
					is_shipping
				}
			}
		}
	}
`
