import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { dehydrate, QueryClient, useInfiniteQuery, useQuery } from 'react-query'
import Layout from '../components/Layout'
import Select from 'react-select'
import queries from '../lib/graphql'
import { authenticatedGraphQl } from '../lib/helpers'
import ProductCard from '../components/ProductCard'

import useInView from '../lib/useInView'
import { RefObject, useEffect, useState } from 'react'
import { request } from 'graphql-request'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'

function FilterAccordion({ setCat }: { setCat: (ids: [string]) => void }) {
	const { CATEGORIES } = queries
	const { data } = useQuery(
		'categories',
		async () => {
			const data_1 = request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				CATEGORIES
			)
			return data_1
		},
		{ staleTime: 60 * 5 * 1000 }
	)

	return (
		<div className="flex flex-col gap-1 sm:flex-row sm:px-4">
			<Select
				className="sm:w-80"
				getOptionLabel={(option) => option.attributes.name}
				getOptionValue={(option) => option.id}
				options={data.categories.data}
				isMulti
				placeholder="Select Categories"
				instanceId="tags"
				onChange={(values) => setCat(values.map((tag) => tag.id) as [string])}
			/>
		</div>
	)
}

const LIMIT = 6
const Home = () => {
	// console.log(products.products.data)

	const [ref, inView] = useInView()
	const [categories, setCategories] = useState<[string]>([])
	const { PRODUCTS } = queries
	// console.log(products.products)

	const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
		['products', categories],
		async ({ pageParam = 0 }) => {
			return await request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				PRODUCTS,
				{
					pagination: { start: pageParam, limit: LIMIT },
					...(categories.length && {
						filters: { and: { categories: { id: { in: categories } } } },
					}),
				}
			)
		},
		{
			getNextPageParam: (lastCount) => {
				return lastCount.products.meta.pagination.page <
					lastCount.products.meta.pagination.pageCount
					? lastCount.products.meta.pagination.page *
							lastCount.products.meta.pagination.pageSize
					: undefined
			},
		}
	)
	// console.log(inView)

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inView])

	return (
		<>
			<Head>
				<title>herbal medicine | Herboca</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout>
				<FilterAccordion setCat={setCategories} />
				{/* <LayoutGroup> */}
				<motion.ul
					className="grid gap-6 grid-cols-responsive-cols-md min-w-full justify-center mt-4"
					layoutScroll
					// layout="position"
				>
					<AnimatePresence>
						{data?.pages
							.map((e) => e.products.data)
							.flat()
							.map(({ attributes, id }: any) => {
								return (
									<ProductCard
										key={id}
										productDetails={{ id, ...attributes }}
									/>
								)
							})}
					</AnimatePresence>
				</motion.ul>

				{/* loading logic */}
				{!isLoading && !hasNextPage && (
					<motion.div
						className="flex justify-center max-w-lg mx-auto bg-slate-200/60 p-5 m-5 text-slate-600/75 shadow-md rounded-md text-center"
						initial={{ opacity: 0, scale: 0 }}
						whileInView={{ opacity: 1, scale: 1 }}
						// viewport={{ once: true }}
						layout="position"
					>
						You've reached the end!
					</motion.div>
				)}
				{/* </LayoutGroup> */}

				<div
					className="h-1 bg-transparent"
					ref={ref as RefObject<HTMLDivElement>}
				></div>
			</Layout>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO, PRODUCTS, CATEGORIES } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	const user_stats = queryClient.prefetchQuery('user_stats', async () => {
		const data_1 = gqlClient.request(USER_INFO)
		return data_1
	})

	const cats = queryClient.prefetchQuery('categories', async () => {
		const data_1 = gqlClient.request(CATEGORIES)

		return data_1
	})

	const products = queryClient.prefetchInfiniteQuery(
		['products', []],
		async ({ pageParam = 0 }) => {
			return await request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				PRODUCTS,
				{
					pagination: { start: pageParam, limit: LIMIT },
				}
			)
		}
	)

	await Promise.all([products, user_stats, cats])

	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
		},
	}
}

export default Home
