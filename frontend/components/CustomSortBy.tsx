import { Dialog, Listbox, RadioGroup, Transition } from '@headlessui/react'

import React from 'react'
import {
	SortByProps,
	useSortBy,
	UseSortByProps,
} from 'react-instantsearch-hooks-web'

import Hamburger, { useToggle } from './Hamburger'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SortByItem } from '../lib/types'
import SubmitButton from './Input/SubmitButton'

const MAIN_MENU_TRANSITION = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,

		transition: {
			delayChildren: 0.2,
			staggerChildren: 0.1,
		},
	},
}

const MENU_TRANSITION = {
	initial: {
		y: '100%',
	},
	animate: {
		y: 0,
	},
	exit: {
		y: '100%',
	},
}

const MobileSortBy = ({
	currentRefinement,
	options,
	refine,
}: {
	currentRefinement: string
	options: SortByItem[]
	refine: (value: string) => void
}) => {
	const { toggle } = useToggle()
	const onClick = () => {
		toggle(1)
	}

	return (
		<motion.div
			className="flex flex-col gap-2 capitalize py-12 text-xl px-4 justify-between min-h-full"
			variants={MAIN_MENU_TRANSITION}
			initial="initial"
			animate="animate"
		>
			<div>
				<h1 className="text-slate-700 font-semibold text-2xl mb-5">Filter</h1>
				<RadioGroup value={currentRefinement} onChange={refine}>
					<RadioGroup.Label className="text-base font-semibold text-slate-500">
						Sort By
					</RadioGroup.Label>
					<div className="space-y-3 mt-2">
						{options.map((opt) => (
							<RadioGroup.Option value={opt.value} key={opt.label}>
								{({ checked, active }) => (
									<span
										className={`text-sm p-2 text-center block rounded-lg shadow-sm cursor-pointer ${
											!checked && 'bg-slate-300/30'
										} tracking-wide ${
											active &&
											'ring-2 ring-blue-300 ring-offset-4 ring-offset-emerald-200/60'
										} ${checked && 'bg-slate-800 text-white'}`}
									>
										{opt.label}
									</span>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
			</div>
			<SubmitButton className="rounded-lg shadow-md text-sm" onClick={onClick}>
				Apply
			</SubmitButton>
		</motion.div>
	)
}

export default function CustomSortBy(props: UseSortByProps) {
	const { currentRefinement, options, refine } = useSortBy(props)
	const { toggle } = useToggle()
	const selectedRefinement = currentRefinement !== 'product'

	const onClick = () => {
		toggle(1)
	}

	return (
		<div>
			<Listbox value={currentRefinement} onChange={refine}>
				<div className="sm:w-48 hidden sm:block">
					<Listbox.Button className={`capitalize flex justify-end w-full`}>
						<span>sort by</span>
						{selectedRefinement ? (
							<span className="text-slate-500">
								: {options.find((e) => e.value === currentRefinement)?.label}
							</span>
						) : (
							''
						)}
					</Listbox.Button>
					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-95 opacity-0"
					>
						<Listbox.Options className="absolute bg-slate-100 w-full flex flex-col items-end">
							{options.map((person) => (
								<Listbox.Option key={person.value} value={person.value}>
									{({ active, selected }) => (
										// person.label
										<li
											className={`${(active || selected) && 'text-slate-500'}`}
										>
											{person.label}
										</li>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
			<button onClick={onClick} className="sm:hidden flex items-center ml-2">
				<svg
					id="i-options"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 32 32"
					width="23"
					height="23"
					fill="none"
					stroke="currentcolor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				>
					<path d="M28 6 L4 6 M28 16 L4 16 M28 26 L4 26 M24 3 L24 9 M8 13 L8 19 M20 23 L20 29" />
				</svg>
			</button>
			<Hamburger
				id={1}
				variants={MENU_TRANSITION}
				className="fixed top-0 overflow-y-auto w-full bg-slate-100 h-screen border-0
				flex flex-col gap-3 sm:hidden z-30 overflow-x-hidden"
			>
				{(_) => {
					return (
						<Dialog.Panel className="h-full w-full">
							<button
								onClick={onClick}
								className="inline-block w-fit fixed top-6 right-6"
							>
								<Image
									src="/crossBlack.svg"
									height={23}
									width={23}
									alt="cross"
								/>
							</button>
							<MobileSortBy
								options={options}
								currentRefinement={currentRefinement}
								refine={refine}
							/>
						</Dialog.Panel>
					)
				}}
			</Hamburger>
		</div>
	)
}
