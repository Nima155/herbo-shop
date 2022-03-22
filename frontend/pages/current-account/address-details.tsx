import React, { useEffect, useMemo, useState } from 'react'
import AddressCard from '../../components/AddressCard'
import { RadioGroup } from '@headlessui/react'
import Layout from '../../components/Layout'

import { GetServerSideProps } from 'next'
import {
	dehydrate,
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from 'react-query'
import { authenticatedGraphQl } from '../../lib/helpers'

import queries from '../../lib/graphql'
import produce from 'immer'
import AddressForm from '../../components/AddressForm'
import camelCaseKeys from 'camelcase-keys'
import { useDebouncedCallback } from 'use-debounce'
import { IAddress } from '../../lib/types'

export default function Shipping() {
	const gqlClient = authenticatedGraphQl()
	const { GET_ADDRESSES, CSRF, UPDATE_ADDRESS } = queries
	const queryCache = useQueryClient()

	const muatation = useMutation(
		async (id: string) => {
			const { _csrf } = await gqlClient.request(CSRF)

			return await gqlClient.request(
				UPDATE_ADDRESS,
				{
					address: {
						is_shipping: true,
					},
					id,
				},
				{
					'x-xsrf-token': _csrf,
				}
			)
		},
		{
			onSuccess: (res) => {
				// TODO communicate with strapi
				fetch('/api/set-address', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				})
				queryCache.setQueryData('user_addresses', (old) => {
					return produce(old, (newState) => {
						newState.me.addresses = newState.me.addresses.map((e) => {
							const { attributes, id } = e
							return {
								id,
								attributes: {
									...attributes,
									is_shipping:
										res.updateAddress.data.id === id &&
										res.updateAddress.data.attributes.is_shipping,
								},
							}
						})
					})
				})
			},
		}
	)
	const { data: userAddresses } = useQuery(
		'user_addresses',
		async () => {
			const data_1 = await gqlClient.request(GET_ADDRESSES)
			return data_1
		},
		{ staleTime: 5000 }
	)
	// console.log(userAddresses)
	console.log(userAddresses?.me?.addresses)

	const addresses = useMemo(() => {
		const camelAddresses = camelCaseKeys(userAddresses?.me?.addresses, {
			deep: true,
		}).map((e) => {
			const addressOne = e.attributes.address1
			delete e.attributes['address1']
			e.attributes['addressOne'] = addressOne
			return e
		})
		camelAddresses.sort((a, b) => a.id < b.id)
		return camelAddresses
	}, [userAddresses])

	const [selected, setSelected] = useState(
		addresses?.find((e) => {
			return e.attributes.isShipping
		})?.id
	)
	// console.log(addresses)

	const debouncedShipping = useDebouncedCallback((id) => {
		muatation.mutate(id)
	}, 1000)

	useEffect(
		() => () => {
			debouncedShipping.flush()
		},
		[debouncedShipping]
	)
	// const [modalStatus, setModalStatus] = useState(-1)
	return (
		<Layout>
			<div className="md:px-8 py-2 grid grid-rows-2 md:grid-cols-2 md:grid-rows-none gap-2">
				<section>
					<h2 className="font-semibold text-xl mb-4 text-slate-700 border-b-2 border-emerald-500 inline-block">
						Addresses
					</h2>
					<RadioGroup
						className="grid grid-cols-responsive-cols-sm gap-4 justify-center"
						value={selected}
						onChange={(e) => {
							setSelected(e)
							debouncedShipping(e)
						}}
					>
						<RadioGroup.Label className="sr-only">
							My addresses
						</RadioGroup.Label>
						{addresses.map((add) => (
							<AddressCard
								addressDetails={{ ...add.attributes, id: add.id }}
								key={add.id}
							/>
						))}
					</RadioGroup>
				</section>

				<section>
					<div className="flex flex-col items-center px-4 rounded-lg shadow-md relative">
						<h2 className="font-semibold text-xl mb-4 text-slate-700 border-b-2 border-emerald-500 mr-auto md:mr-0">
							New Address
						</h2>
						<AddressForm
							buttonText="Add Address"
							query={{ queryURL: queries.CREATE_ADDRESS }}
						/>
					</div>
				</section>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO, GET_ADDRESSES } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	const userStatsPromise = queryClient.prefetchQuery('user_stats', async () => {
		return gqlClient.request(USER_INFO)
	})
	const userAddressesPromise = queryClient.prefetchQuery(
		'user_addresses',
		async () => {
			return gqlClient.request(GET_ADDRESSES)
		}
	)

	await Promise.all([userStatsPromise, userAddressesPromise])

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	}
}
