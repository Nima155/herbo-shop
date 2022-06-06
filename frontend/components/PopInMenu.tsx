import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useToggle } from './Hamburger'

const ANCHOR_TRANSITION = {
	initial: {
		x: -20,
		opacity: 0,
	},
	animate: {
		opacity: 1,
		x: 0,
	},
}

export default function PopInMenu({
	children,
}: {
	children: (animation: any) => React.ReactNode
}) {
	const { toggle } = useToggle()

	useEffect(() => {
		function eventHandler(event: MouseEvent) {
			const element = event?.target as HTMLElement
			if (element.tagName === 'A') {
				toggle(0)
			}
		}

		document.addEventListener('click', eventHandler)
		return () => {
			document.removeEventListener('click', eventHandler)
		}
	}, [])

	return children(ANCHOR_TRANSITION) as JSX.Element
}
