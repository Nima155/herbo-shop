import React, { useRef } from 'react'
import ReactDom from 'react-dom'
import { motion, Variants } from 'framer-motion'
import { Dialog } from '@headlessui/react'
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

	return (
		<Dialog
			open={modalIsOpen}
			onClose={modalSetter}
			as="div"
			className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center"
		>
			<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
			<div className="mx-2">
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
		</Dialog>
	)
}
