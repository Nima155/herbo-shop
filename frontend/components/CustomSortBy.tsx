import { Listbox, Transition } from '@headlessui/react'

import React from 'react'
import { useSortBy, UseSortByProps } from 'react-instantsearch-hooks-web'
import Hamburger, { useToggle } from './Hamburger'
import Image from 'next/image'
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

export default function CustomSortBy(props: UseSortByProps) {
	const { currentRefinement, options, refine } = useSortBy(props)
	const { toggle, toggled } = useToggle()
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
			<button onClick={onClick} className="sm:hidden flex items-center">
				<svg
					id="i-options"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 32 32"
					width="32"
					height="32"
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
				{(animation) => {
					return (
						<div>
							<button onClick={onClick}>
								<Image
									src="/crossBlack.svg"
									height={32}
									width={32}
									alt="cross"
								/>
							</button>
						</div>
					)
				}}
			</Hamburger>
		</div>
	)
}
