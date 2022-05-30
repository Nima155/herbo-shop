import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import Layout from '../components/Layout'
import Select from 'react-select'
import queries from '../lib/graphql'
import { authenticatedGraphQl } from '../lib/helpers'
import ProductCard from '../components/ProductCard'
import useInView from '../lib/useInView'
import { request } from 'graphql-request'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Image from 'next/image'
import {
	Configure,
	InstantSearch,
	RefinementList,
	SearchBox,
	SortBy,
	useInfiniteHits,
	UseInfiniteHitsProps,
} from 'react-instantsearch-hooks-web'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { RefObject, useEffect, useRef, useState } from 'react'
import CustomSortBy from '../components/CustomSortBy'

const searchClient = instantMeiliSearch('http://127.0.0.1:7700')

const CustomInfiniteHits = (props: UseInfiniteHitsProps) => {
	const { hits, isLastPage, showMore } = useInfiniteHits(props)
	const [ref, inView] = useInView()

	useEffect(() => {
		if (inView && !isLastPage) {
			showMore()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inView])

	return (
		<LayoutGroup>
			<motion.ul
				className="grid gap-6 grid-cols-responsive-cols-md min-w-full justify-center mt-4"
				layoutScroll
				// layout="position"
			>
				<AnimatePresence>
					{hits.map((hit) => (
						<Hit hit={hit} key={hit.id as string} />
					))}
				</AnimatePresence>
			</motion.ul>
			{!hits.length && (
				<motion.div
					className="flex justify-center max-w-lg mx-auto bg-slate-200/60 p-5 m-5 text-slate-600/75 shadow-md rounded-md text-center"
					initial={{ opacity: 0, scale: 0 }}
					whileInView={{ opacity: 1, scale: 1 }}
					// viewport={{ once: true }}
					layout="position"
				>
					Sorry, couldn&apos;t find what you are looking for!
				</motion.div>
			)}

			<div
				className="h-1 bg-transparent"
				ref={ref as RefObject<HTMLDivElement>}
			></div>
		</LayoutGroup>
	)
}

function Search() {
	const searchRef = useRef<null | ((_: string) => void)>(null)
	// console.log('bye', searchRef)

	return (
		<InstantSearch indexName="product" searchClient={searchClient}>
			<Configure hitsPerPage={20} />

			{/* <RefinementList attribute="categories.name" /> */}

			<div className="flex justify-between items-center pr-5">
				<SearchBox
					placeholder="product, category, brand"
					queryHook={(_, search) => {
						searchRef.current = search
					}}
					onSubmit={(event) => {
						if (searchRef.current) {
							searchRef?.current(event.target.firstChild.value)
						}
					}}
					submitIconComponent={() => (
						<div className="ml-1 absolute left-0 top-1/2 -translate-y-1/2">
							<Image
								src="/search.svg"
								width={15}
								height={15}
								alt="search icon"
							/>
						</div>
					)}
					resetIconComponent={() => (
						<div className="absolute top-1/2 right-1 -translate-y-1/2 z-20">
							<Image
								src="/crossBlack.svg"
								width={15}
								height={15}
								alt="cross icon"
							/>
						</div>
					)}
					classNames={{
						input: 'ml-6 px-2 py-1 rounded-md bg-slate-200 focus:outline-none',
						form: 'relative bg-slate-200 sm:inline-block rounded-md sm:mx-4 max-w-sm focus-within:border-blue-400 border-2 shadow-sm',
					}}
				/>
				<CustomSortBy
					items={[
						{ label: 'Price: High-Low', value: 'product:price:desc' },
						{ label: 'Price: Low-High', value: 'product:price:asc' },
					]}
				/>
				{/* TODO: correct the shite! */}
			</div>
			<CustomInfiniteHits escapeHTML={true} />
		</InstantSearch>
	)
}

const Hit = ({ hit }) => {
	return <ProductCard key={hit.id} productDetails={{ ...hit }} />
}

const LIMIT = 6
const Home = () => {
	// console.log(products.products.data)

	// const [categories, setCategories] = useState<[string]>([])
	// const { PRODUCTS } = queries
	// console.log(products.products)

	// const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
	// 	['products', categories],
	// 	async ({ pageParam = 0 }) => {
	// 		return await request(
	// 			process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
	// 			PRODUCTS,
	// 			{
	// 				pagination: { start: pageParam, limit: LIMIT },
	// 				...(categories.length && {
	// 					filters: { and: { categories: { id: { in: categories } } } },
	// 				}),
	// 			}
	// 		)
	// 	},
	// 	{
	// 		getNextPageParam: (lastCount) => {
	// 			return lastCount.products.meta.pagination.page <
	// 				lastCount.products.meta.pagination.pageCount
	// 				? lastCount.products.meta.pagination.page *
	// 						lastCount.products.meta.pagination.pageSize
	// 				: undefined
	// 		},
	// 	}
	// )
	// console.log(data)

	// console.log(inView)

	// useEffect(() => {
	// 	if (inView && hasNextPage) {
	// 		fetchNextPage()
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [inView])

	return (
		<>
			<Head>
				<title>herbal medicine | Herboca</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout>
				{/* <FilterAccordion setCat={setCategories} /> */}
				{/* <LayoutGroup> */}
				<Search />
				{/* <motion.ul
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
				</motion.ul> */}

				{/* loading logic */}
				{/* {!isLoading && !hasNextPage && (
					<motion.div
						className="flex justify-center max-w-lg mx-auto bg-slate-200/60 p-5 m-5 text-slate-600/75 shadow-md rounded-md text-center"
						initial={{ opacity: 0, scale: 0 }}
						whileInView={{ opacity: 1, scale: 1 }}
						// viewport={{ once: true }}
						layout="position"
					>
						You've reached the end!
					</motion.div>
				)} */}
				{/* </LayoutGroup> */}

				{/* <div
					className="h-1 bg-transparent"
					ref={ref as RefObject<HTMLDivElement>}
				></div> */}
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
