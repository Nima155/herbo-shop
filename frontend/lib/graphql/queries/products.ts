import { gql } from 'graphql-request'

export default gql`
	query Products($ids: [ID], $pagination: PaginationArg) {
		products(filters: { id: { in: $ids } }, pagination: $pagination) {
			data {
				id
				attributes {
					price
					name
					categories {
						data {
							attributes {
								name
							}
						}
					}
					description
					picture {
						data {
							attributes {
								url
								formats
							}
						}
					}
				}
			}
			meta {
				pagination {
					total
					page
					pageSize
					pageCount
				}
			}
		}
	}
`
