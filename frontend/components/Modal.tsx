import React, { useEffect, useRef, useState } from 'react'
import ReactDom from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import useOnClickOutside from '../lib/useOnClickOutside'
export default function Modal({
	children,
	modalActivator,
	modalIsOpen,
}: {
	children?: React.ReactNode
	modalActivator: () => void
	modalIsOpen: boolean
}) {
	const [isReady, setIsReady] = useState(false)
	const elementRef = useRef<HTMLDivElement>(null)

	useOnClickOutside(elementRef, () => {
		modalActivator()
	})

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsReady(true)
		}
	}, [])

	const variants = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0 },
	}

	return isReady ? (
		ReactDom.createPortal(
			isReady && modalIsOpen && (
				<div className="flex flex-col absolute h-full w-full top-0 left-0 z-10 bg-black opacity-70 justify-center items-center">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={variants}
						ref={elementRef}
						className="bg-white p-10 flex flex-col rounded-md"
					>
						{children}
					</motion.div>
				</div>
			),
			document.getElementById('myportal')!
		)
	) : (
		<></>
	)
}
