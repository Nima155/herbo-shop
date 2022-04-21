import { gql } from 'graphql-request'

export default gql`
	mutation UpdateUser($data: UsersPermissionsUserInput!, $id: ID!) {
		updateUsersPermissionsUser(data: $data, id: $id) {
			data {
				id
			}
		}
	}
`
