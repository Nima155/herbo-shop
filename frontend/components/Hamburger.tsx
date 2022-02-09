import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PopInMenu from './PopInMenu'

const BURGER_LINES = [
	{ rotate: 45, y: 5.5 },
	{ opacity: 0, x: 8 },
	{ rotate: -45, y: -7 },
]

export default function Hamburger() {
	const [show, setShow] = useState(false)
	return (
		<div className="sm:hidden">
			<ul
				className={`bg-green-300 p-2 rounded-full h-8 w-8 flex flex-col gap-1 cursor-pointer shadow-md ${
					show ? 'fixed' : 'relative'
				} z-10`}
				onClick={() => setShow((s) => !s)}
			>
				{BURGER_LINES.map((e, i) => (
					<motion.li
						key={i}
						className="bg-black h-1"
						animate={show ? e : { rotate: 0 }}
					/>
				))}
			</ul>
			<PopInMenu active={show} />
		</div>
	)
}
