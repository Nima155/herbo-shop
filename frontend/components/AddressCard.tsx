import React, { useState } from 'react'
import { Address } from '../lib/types'
import Image from 'next/image'
import Modal from './Modal'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Dialog, RadioGroup } from '@headlessui/react'
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
							} rounded-lg bg-white p-2 relative transition-all flex flex-col items-start`}
						>
							<motion.div className={`absolute right-2 top-2 h-6 w-6`}>
								<CheckIcon
									className={`w-6 h-6 ${
										checked && 'bg-emerald-500'
									} rounded-full transition-colors`}
								/>
							</motion.div>
							<motion.p
								layoutId={`country ${addressDetails?.zipCode}`}
								className="self-start"
							>
								{addressDetails?.country}
							</motion.p>
							<motion.p
								layoutId={`county ${addressDetails?.zipCode}`}
								className="self-start"
							>
								{addressDetails?.county}
							</motion.p>
							<motion.p
								layoutId={`city ${addressDetails?.zipCode}`}
								className="self-start"
							>
								{addressDetails?.city}
							</motion.p>
							<motion.p
								layoutId={`address ${addressDetails?.zipCode}`}
								className="self-start"
							>
								{addressDetails?.addressOne}
							</motion.p>
							<motion.p
								layoutId={`zip ${addressDetails?.zipCode}`}
								className="self-start"
							>
								{addressDetails?.zipCode}
							</motion.p>
							<motion.button
								onClick={(e) => {
									setModalStatus(true)
									e.stopPropagation()
								}}
								className="hover:underline ml-auto inline-block text-sm font-medium text-slate-500"
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
						<Dialog
							open={modalStatus}
							onClose={() => {
								setModalStatus(false)
							}}
							as={motion.div}
							key={'modal'}
							className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center"
						>
							<Dialog.Overlay
								className="fixed inset-0 bg-black"
								key={'backdrop'}
								as={motion.div}
								variants={{
									hidden: {
										opacity: 0,
										transition: {
											duration: 0.16,
										},
									},
									visible: {
										opacity: 0.3,
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
							<motion.div
								layoutId={`dep ${addressDetails?.zipCode}`}
								className="bg-white rounded-lg p-2 relative flex flex-col items-start"
							>
								<motion.p layoutId={`country ${addressDetails?.zipCode}`}>
									{addressDetails?.country}
								</motion.p>

								<motion.p layoutId={`county ${addressDetails?.zipCode}`}>
									{addressDetails?.county}
								</motion.p>

								<motion.p layoutId={`city ${addressDetails?.zipCode}`}>
									{addressDetails?.city}
								</motion.p>

								<motion.p layoutId={`address ${addressDetails?.zipCode}`}>
									{addressDetails?.addressOne}
								</motion.p>

								<motion.p layoutId={`zip ${addressDetails?.zipCode}`}>
									{addressDetails?.zipCode}
								</motion.p>
								<motion.button
									layoutId={`button ${addressDetails.zipCode}`}
									className="text-sm mt-4 bg-emerald-400 px-4 py-1 text-slate-100 rounded-lg inline-block"
								>
									update
								</motion.button>
							</motion.div>
						</Dialog>
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
