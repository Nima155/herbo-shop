import React from 'react'
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion'

const CONTAINER: Variants = {
	enter: {
		transition: {
			staggerChildren: 0.2,
		},
	},
	end: {
		transition: {
			staggerChildren: 0.2,
		},
	},
}

const ITEM: Variants = {
	enter: {
		scale: 0,
	},
	end: {
		scale: 1,
	},
}

const TRANSITION: Transition = {
	repeat: Infinity,
	repeatType: 'reverse',
	ease: 'easeInOut',
	duration: 0.5,
}
export default function LoadingDots() {
	return (
		<motion.div
			variants={CONTAINER}
			initial="enter"
			animate="end"
			className="flex gap-1 justify-center items-center z-50 bg-white/80 inset-0 absolute rounded-md"
		>
			{[0, 1, 2].map((e) => (
				<motion.span
					variants={ITEM}
					className="bg-green-900 rounded-full w-3 h-3 block"
					transition={TRANSITION}
					key={e}
				/>
			))}
		</motion.div>
	)
}
