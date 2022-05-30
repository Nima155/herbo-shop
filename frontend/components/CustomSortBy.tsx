import { Listbox, Transition } from '@headlessui/react'
import React from 'react'
import { useSortBy, UseSortByProps } from 'react-instantsearch-hooks-web'

export default function CustomSortBy(props: UseSortByProps) {
	const { currentRefinement, options, refine, hasNoResults, initialIndex } =
		useSortBy(props)

	return (
		<Listbox value={currentRefinement} onChange={refine}>
			<div>
				<Listbox.Button className="capitalize">{`sort by${
					currentRefinement !== 'product'
						? `: ${options.find((e) => e.value === currentRefinement)?.label}`
						: ''
				}`}</Listbox.Button>
				<Transition
					enter="transition duration-100 ease-out"
					enterFrom="transform scale-95 opacity-0"
					enterTo="transform scale-100 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-95 opacity-0"
				>
					<Listbox.Options className="absolute bg-slate-100 w-40">
						{options.map((person) => (
							<Listbox.Option key={person.value} value={person.value}>
								{person.label}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	)
}
