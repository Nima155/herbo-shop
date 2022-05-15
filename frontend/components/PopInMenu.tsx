import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useToggle } from './Hamburger'

const MENU_TRANSITION = {
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

export default function PopInMenu() {
	const { toggle } = useToggle()

	useEffect(() => {
		function eventHandler(event: MouseEvent) {
			const element = event?.target as HTMLElement
			if (element.tagName === 'A') {
				toggle()
			}
		}

		document.addEventListener('click', eventHandler)
		return () => {
			document.removeEventListener('click', eventHandler)
		}
	}, [])

	return (
		<Dialog.Panel className="h-full w-full pt-16">
			<motion.div
				className="flex flex-col gap-5 capitalize items-center justify-center pt-20 text-xl"
				variants={MENU_TRANSITION}
				initial="initial"
				animate="animate"
			>
				<Link href="/current-account/update-profile" passHref scroll={false}>
					<motion.a variants={ANCHOR_TRANSITION}>Profile</motion.a>
				</Link>
				<Link href="/current-account/address-details" passHref scroll={false}>
					<motion.a variants={ANCHOR_TRANSITION}>Shipping</motion.a>
				</Link>
				<Link href="/current-account/orders" passHref scroll={false}>
					<motion.a variants={ANCHOR_TRANSITION}>Orders</motion.a>
				</Link>
				<motion.button
					className="hover:text-emerald-600 transition-colors"
					variants={ANCHOR_TRANSITION}
					// onClick={logoutMutation.mutate}
				>
					{/* logout button */}logout
				</motion.button>
			</motion.div>
		</Dialog.Panel>
	)
}
