import React, { Fragment, useState } from 'react'
import { IAddress } from '../lib/types'
import Image from 'next/image'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import AddressForm from './AddressForm'
import styled from 'styled-components'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { AVAILABLE_COUNTRIES } from '../lib/constants'
import Button from './Button'
import { useMutation, useQueryClient } from 'react-query'
import produce from 'immer'
import { authenticatedGraphQl } from '../lib/helpers'
import queries from '../lib/graphql'

const { CSRF, DELETE_ADDRESS } = queries
const EllipsisParagraph = styled.p`
	max-width: 210px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`
export default function AddressCard(props: {
	addressDetails: IAddress & { id?: string }
	className?: string
	setDefaultIndex: () => void
}) {
	const { addressDetails, className, setDefaultIndex } = props
	const [modalStatus, setModalStatus] = useState(false)
	// console.log('hey stud!')
	const { control } = useFormContext()
	const gqlClient = authenticatedGraphQl()
	const queryCache = useQueryClient()

	const muatation = useMutation(
		async (id: string) => {
			const { _csrf } = await gqlClient.request(CSRF)

			return await gqlClient.request(
				DELETE_ADDRESS,
				{
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
				queryCache.setQueryData('user_addresses', (old) => {
					return produce(old, (newState) => {
						newState.me.addresses = newState.me.addresses.filter(
							(e) => e.id !== res.deleteAddress.data.id
						)
					})
				})
			},
		}
	)

	const { fields, append, remove } = useFieldArray({
		name: 'addressForms',
		control,
	})
	// console.log(fields)

	return (
		<>
			<RadioGroup.Option
				value={addressDetails.id}
				disabled={modalStatus}
				// className={`rounded-lg bg-white p-2 relative`}
			>
				{({ checked }) => {
					return (
						<div
							className={`${
								checked ? 'shadow-lg' : 'shadow-md'
							} rounded-lg bg-white p-2`}
						>
							<div
								className={`${
									!checked && 'opacity-50'
								} relative transition-all flex flex-col items-start`}
							>
								<div className={`absolute right-2 top-2 h-6 w-6`}>
									<CheckIcon
										className={`w-6 h-6 ${
											checked ? 'bg-emerald-500' : 'bg-gray-400/70'
										} rounded-full  transition-colors`}
									/>
								</div>
								<EllipsisParagraph>
									{addressDetails?.firstName}
								</EllipsisParagraph>
								<EllipsisParagraph>
									{addressDetails?.lastName}
								</EllipsisParagraph>
								<EllipsisParagraph>
									{addressDetails?.addressOne}
								</EllipsisParagraph>
								<EllipsisParagraph>{addressDetails?.country}</EllipsisParagraph>
								<EllipsisParagraph>{addressDetails?.state}</EllipsisParagraph>
								<EllipsisParagraph>{addressDetails?.city}</EllipsisParagraph>
								<EllipsisParagraph>{addressDetails?.zipCode}</EllipsisParagraph>
								<EllipsisParagraph>
									{addressDetails?.phoneNumber}
								</EllipsisParagraph>
							</div>
							<div className="flex justify-end">
								<Button
									className="text-sm font-medium text-slate-100 ml-2 bg-red-500/70 px-2 py-1 rounded-full shadow-md"
									onClick={(e) => {
										e.stopPropagation()
										muatation.mutate(addressDetails.id!)
									}}
								>
									Delete
								</Button>
								<Button
									onClick={(e) => {
										setModalStatus(true)
										const { id, ...rest } = addressDetails

										const newPhoneNumber = AVAILABLE_COUNTRIES.find(
											(e) => e.code === rest.country
										)

										rest.phoneNumber = rest.phoneNumber.slice(
											newPhoneNumber?.phoneCode.toString().length
										)
										remove()
										append({ ...rest })
										setDefaultIndex()
										e.stopPropagation()
									}}
									className="text-sm font-medium text-slate-100 ml-2 bg-blue-700/70 px-2 py-1 rounded-full shadow-md"
								>
									Edit
								</Button>
							</div>
						</div>
					)
				}}
			</RadioGroup.Option>

			<Transition
				appear={true}
				show={modalStatus}
				enter="transition-opacity duration-100 ease-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-75 ease-out"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				as={Fragment}
			>
				<Dialog
					onClose={() => {
						setModalStatus(false)
						remove(fields.length - 1)
					}}
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center"
				>
					<Dialog.Overlay className="fixed inset-0 bg-black/30" />

					<div className="bg-white rounded-lg py-2 px-3 relative flex flex-col items-start ring-inset ring-emerald-200 ring-2">
						<AddressForm
							address={addressDetails}
							buttonText="Apply Changes"
							query={{
								queryURL: queries.UPDATE_ADDRESS,
								queryArgs: { id: addressDetails.id },
							}}
							closeModal={() => {
								setModalStatus(false)

								remove(fields.length - 1)
							}}
							index={fields.length - 1}
						/>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" className={className}>
			<circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
			<path
				d="M7 13l3 3 7-7"
				stroke="#fff"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
