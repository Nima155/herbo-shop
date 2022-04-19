import { gql } from 'graphql-request'

export default gql`
	query Orders(
		$filters: OrderFiltersInput
		$pagination: PaginationArg
		$sort: [String]
	) {
		orders(filters: $filters, pagination: $pagination, sort: $sort) {
			meta {
				pagination {
					total
				}
			}
			data {
				attributes {
					status
					total_cost
					createdAt
					order_lists {
						data {
							attributes {
								quantity
								product {
									data {
										attributes {
											name
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
								}
							}
						}
					}
				}
			}
		}
	}
`
