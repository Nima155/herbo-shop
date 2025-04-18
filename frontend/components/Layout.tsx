import React from 'react'
import { motion } from 'framer-motion'

const variants = {
	hidden: { opacity: 0, x: -200, y: 0 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: 0, y: -100 },
}
export default function Layout({
	children,
	twStyles,
}: {
	children?: React.ReactNode
	twStyles?: string
}) {
	return (
		<div className={`p-5 max-w-screen-xl mx-auto mt-20`}>
			<motion.main
				className={twStyles}
				variants={variants} // Pass the variant object into Framer Motion
				initial="hidden" // Set the initial state to variants.hidden
				animate="enter" // Animated state to variants.enter
				exit="exit" // Exit state (used later) to variants.exit
				transition={{ type: 'linear' }} // Set the transition to linear
			>
				{children}
			</motion.main>
		</div>
	)
}
