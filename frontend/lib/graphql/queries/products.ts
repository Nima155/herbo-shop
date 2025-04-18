import { gql } from 'graphql-request'

export default gql`
	query Products($filters: ProductFiltersInput, $pagination: PaginationArg) {
		products(filters: $filters, pagination: $pagination) {
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
