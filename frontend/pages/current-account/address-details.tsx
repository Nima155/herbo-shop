import React, { useState } from 'react'
import AddressCard from '../../components/AddressCard'
import { RadioGroup } from '@headlessui/react'
import Layout from '../../components/Layout'
import { type Address, AddressType } from '../../lib/types'
import { GetServerSideProps } from 'next'
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query'
import { authenticatedGraphQl } from '../../lib/helpers'

import queries from '../../lib/graphql'

import AddressForm from '../../components/AddressForm'

const addresses: Address[] = [
	{
		country: 'United States',
		city: 'New york',
		addressOne: 'Manhattan no 1',
		addressType: AddressType.Shipping,
		firstName: 'Jake',
		lastName: 'Baldino',
		phoneNumber: '4421242121',
		zipCode: 'LS28 8DS',
		state: 'NY',
	},
	{
		country: 'IR',
		city: 'Mashad',
		addressOne: 'Damavand st',
		addressType: AddressType.Shipping,
		firstName: 'Karun',
		lastName: 'Man',
		phoneNumber: '21312',
		zipCode: 'DS 3R00221',
		state: 'Khorasan',
	},
	{
		country: 'GER',
		city: 'Frankfurt',
		addressOne: 'Authzeieden no 1',
		addressType: AddressType.Shipping,
		firstName: 'Lidya',
		lastName: 'Staple',
		phoneNumber: '2313215542',
		zipCode: 'LS2332 21DS',
		state: 'Frankfurt',
	},
]
export default function Shipping() {
	const [selected, setSelected] = useState(addresses[0])
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
						onChange={setSelected}
					>
						<RadioGroup.Label className="sr-only">
							My addresses
						</RadioGroup.Label>
						{addresses.map((add, i) => (
							<AddressCard addressDetails={add} key={add.zipCode} />
						))}
					</RadioGroup>
				</section>

				<section>
					<div className="flex flex-col items-center px-4 rounded-lg shadow-md relative">
						<h2 className="font-semibold text-xl mb-4 text-slate-700 border-b-2 border-emerald-500 mr-auto md:mr-0">
							New Address
						</h2>
						<AddressForm buttonText="Add Address" />
					</div>
				</section>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	await queryClient.prefetchQuery('user_stats', async () => {
		return gqlClient.request(USER_INFO)
	})

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	}
}
