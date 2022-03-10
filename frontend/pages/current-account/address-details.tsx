import React, { useState } from 'react'
import AddressCard from '../../components/AddressCard'
import { RadioGroup } from '@headlessui/react'
import Layout from '../../components/Layout'
import { Address, AddressType } from '../../lib/types'
import { motion } from 'framer-motion'
const addresses: [Address] = [
	{
		country: 'US',
		city: 'New york',
		addressOne: 'Manhattan no 1',
		addressType: AddressType.shipping,
		county: 'New york',
		zipCode: 'LS28 8DS',
	},
	{
		country: 'IR',
		city: 'Mashad',
		addressOne: 'Damavand st',
		addressType: AddressType.shipping,
		county: 'Khorasan',
		zipCode: 'DS 3R00221',
	},
	{
		country: 'GER',
		city: 'Frankfurt',
		addressOne: 'Authzeieden no 1',
		addressType: AddressType.shipping,
		county: 'Frankfurt',
		zipCode: 'LS2332 21DS',
	},
]
export default function Shipping() {
	const [selected, setSelected] = useState(addresses[0])
	// const [modalStatus, setModalStatus] = useState(-1)
	return (
		<Layout>
			<div className="px-8 py-2 grid grid-rows-2 md:grid-cols-2 md:grid-rows-none gap-2">
				<section>
					<h2 className="font-semibold text-xl mb-4">Addresses:</h2>

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
			</div>
		</Layout>
	)
}
