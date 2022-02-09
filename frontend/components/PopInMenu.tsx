import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

const MENU_TRANSITION = {
	initial: {
		x: '-100vw',
		opacity: 0,
	},
	animate: {
		opacity: 1,
		x: 0,
	},
}

export default function PopInMenu({ active }: { active: boolean }) {
	return (
		<motion.div
			variants={MENU_TRANSITION}
			animate={active ? 'animate' : 'initial'}
			className="fixed w-4/5 bg-green-100 h-full left-0 top-0 border-0 pt-16 pl-5 flex flex-col gap-3"
			transition={{
				staggerChildren: 0.3,
				type: 'tween',
				when: 'beforeChildren',
			}}
		></motion.div>
	)
}
