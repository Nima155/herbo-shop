import React, { useRef } from 'react'
import ReactDom from 'react-dom'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import useOnClickOutside from '../lib/useOnClickOutside'

type ModalProps = {
	children?: React.ReactNode
	modalIsOpen: boolean
	modalSetter: () => void
	twStyles?: string
	twVariants?: Variants
}

export default function Modal({
	children,
	modalIsOpen,
	modalSetter,
	twStyles,
	twVariants,
}: ModalProps) {
	// const [isReady, setIsReady] = useState<boolean>(modalIsOpen)

	const elementRef = useRef<HTMLDivElement>(null)
	useOnClickOutside(elementRef, () => {
		modalSetter()
	})

	return modalIsOpen && typeof window !== 'undefined' ? (
		ReactDom.createPortal(
			modalIsOpen && (
				<div className="flex flex-col absolute h-full w-full top-0 left-0 z-10 bg-black opacity-70 justify-center items-center">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={twVariants}
						ref={elementRef}
						className={twStyles}
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
