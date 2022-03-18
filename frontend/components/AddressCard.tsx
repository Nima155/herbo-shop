import React, { Fragment, useState } from 'react'
import { IAddress } from '../lib/types'

import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import AddressForm from './AddressForm'

export default function AddressCard(props: {
	addressDetails: IAddress
	className?: string
}) {
	const { addressDetails, className } = props
	const [modalStatus, setModalStatus] = useState(false)
	// console.log('hey stud!')

	return (
		<>
			<RadioGroup.Option
				value={addressDetails}
				disabled={modalStatus}
				// className={`rounded-lg bg-white p-2 relative`}
			>
				{({ checked }) => {
					return (
						<div
							className={`${!checked && 'opacity-50'} ${
								checked ? 'shadow-lg' : 'shadow-md'
							} rounded-lg bg-white p-2 relative transition-all flex flex-col items-start`}
						>
							<div className={`absolute right-2 top-2 h-6 w-6`}>
								<CheckIcon
									className={`w-6 h-6 ${
										checked && 'bg-emerald-500'
									} rounded-full transition-colors`}
								/>
							</div>
							<p>{addressDetails?.firstName}</p>
							<p>{addressDetails?.lastName}</p>
							<p>{addressDetails?.addressOne}</p>
							<p>{addressDetails?.country}</p>
							<p>{addressDetails?.state}</p>
							<p>{addressDetails?.city}</p>
							<p>{addressDetails?.zipCode}</p>
							<p>{addressDetails?.phoneNumber}</p>
							<button
								onClick={(e) => {
									setModalStatus(true)
									e.stopPropagation()
								}}
								className="hover:underline ml-auto inline-block text-sm font-medium text-slate-500"
							>
								edit
							</button>
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
					}}
					className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center"
				>
					<Dialog.Overlay className="fixed inset-0 bg-black/30" />

					<div className="bg-white rounded-lg py-2 px-3 relative flex flex-col items-start">
						<AddressForm address={addressDetails} buttonText="Apply Changes" />
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

function CheckIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" {...props}>
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
