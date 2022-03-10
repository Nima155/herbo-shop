import React, { useState } from 'react'
import { Address } from '../lib/types'
import Image from 'next/image'
import Modal from './Modal'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { RadioGroup } from '@headlessui/react'
import SubmitButton from './Input/SubmitButton'

export default function AddressCard(props: {
	addressDetails: Address
	className?: string
}) {
	const { addressDetails, className } = props
	const [modalStatus, setModalStatus] = useState(false)
	// console.log('hey stud!')

	return (
		<LayoutGroup>
			<RadioGroup.Option
				value={addressDetails}
				as={motion.div}
				layoutId={`dep ${addressDetails?.zipCode}`}
				disabled={modalStatus}
				// className={`rounded-lg bg-white p-2 relative`}
			>
				{({ checked }) => {
					return (
						<div
							className={`${!checked && 'opacity-50'} ${
								checked ? 'shadow-lg' : 'shadow-md'
							} rounded-lg bg-white p-2 relative transition-all`}
						>
							<motion.div className={`absolute right-2 top-2 h-6 w-6`}>
								<CheckIcon
									className={`w-6 h-6 ${
										checked && 'bg-emerald-500'
									} rounded-full transition-colors`}
								/>
							</motion.div>
							<motion.p layoutId={`countryid ${addressDetails?.zipCode}`}>
								{addressDetails?.country}
							</motion.p>
							<motion.p layoutId={`countyid ${addressDetails?.zipCode}`}>
								{addressDetails?.county}
							</motion.p>
							<motion.p layoutId={`cityid ${addressDetails?.zipCode}`}>
								{addressDetails?.city}
							</motion.p>
							<motion.p layoutId={`addressid ${addressDetails?.zipCode}`}>
								{addressDetails?.addressOne}
							</motion.p>
							<motion.p layoutId={`zipid ${addressDetails?.zipCode}`}>
								{addressDetails?.zipCode}
							</motion.p>
							<motion.button
								onClick={(e) => {
									setModalStatus(true)
									e.stopPropagation()
								}}
								className="hover:underline ml-auto block text-sm font-medium text-slate-500"
								layoutId={`button ${addressDetails.zipCode}`}
							>
								edit
							</motion.button>
						</div>
					)
				}}
			</RadioGroup.Option>

			<AnimatePresence>
				{modalStatus && (
					<>
						<motion.div
							className="z-30 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
							key={'modal'}
						>
							<motion.div
								layoutId={`dep ${addressDetails?.zipCode}`}
								className="bg-white rounded-lg p-2 sm:h-96 sm:w-96 h-60 w-52 mx-auto"
							>
								Country:
								<motion.p layoutId={`countryid ${addressDetails?.zipCode}`}>
									{addressDetails?.country}
								</motion.p>
								Country:
								<motion.p layoutId={`countyid ${addressDetails?.zipCode}`}>
									{addressDetails?.county}
								</motion.p>
								Country:
								<motion.p layoutId={`cityid ${addressDetails?.zipCode}`}>
									{addressDetails?.city}
								</motion.p>
								Country:
								<motion.p layoutId={`addressid ${addressDetails?.zipCode}`}>
									{addressDetails?.addressOne}
								</motion.p>
								Country:
								<motion.p layoutId={`zipid ${addressDetails?.zipCode}`}>
									{addressDetails?.zipCode}
								</motion.p>
								<motion.button
									layoutId={`button ${addressDetails.zipCode}`}
									className="text-sm mt-4 bg-emerald-400 px-4 py-1 text-slate-100 rounded-lg"
								>
									update
								</motion.button>
							</motion.div>
						</motion.div>
						<motion.div
							className="inset-0 bg-black/40 absolute z-10"
							onClick={(e) => {
								setModalStatus(false)
							}}
							key={'backdrop'}
							variants={{
								hidden: {
									opacity: 0,
									transition: {
										duration: 0.16,
									},
								},
								visible: {
									opacity: 0.8,
									transition: {
										delay: 0.04,
										duration: 0.2,
									},
								},
							}}
							initial="hidden"
							exit="hidden"
							animate="visible"
						/>
					</>
				)}
			</AnimatePresence>
		</LayoutGroup>
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
