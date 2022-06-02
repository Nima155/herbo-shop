import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import produce from 'immer'
import React from 'react'

import create from 'zustand'
import { IModalToggle } from '../lib/types'

import PopInMenu from './PopInMenu'

interface StyledModal extends IModalToggle {
	className?: string
	variants: Variants
}

export const useToggle = create<{
	toggled: boolean[]
	toggle: (id: number, _?: boolean) => void
}>((set) => ({
	toggled: [false, false],
	toggle: (id, targetState) => {
		set(
			produce((state) => {
				state.toggled[id] =
					targetState !== undefined ? targetState : !state.toggled[id]
			})
		)
	},
}))

function HamburgerMenu({
	children,

	id,
	className,
	variants,
}: StyledModal) {
	const { toggled, toggle } = useToggle()
	// fixed z-10 inset-0 overflow-y-auto
	return (
		<AnimatePresence>
			{toggled[id] && (
				<Dialog
					open={toggled[id]}
					onClose={() => {
						toggle(id, false)
					}}
					static
					as={motion.div}
					className={className}
					style={{ minWidth: '16rem' }}
					variants={variants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{
						staggerChildren: 0.3,
						type: 'tween',
						when: 'beforeChildren',
					}}
				>
					{/* <MenuToggle id={id} menuToggleChildren={menuToggleChildren} /> */}
					<Dialog.Backdrop
						className="fixed inset-0 bg-black opacity-30 z-30"
						as={motion.div}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.3 }}
						exit={{ opacity: 0 }}
					/>

					<PopInMenu>{children!}</PopInMenu>
				</Dialog>
			)}
		</AnimatePresence>
	)
}

export default function Hamburger(props: StyledModal) {
	const { children, ...rest } = props
	return (
		<>
			{/* <MenuToggle {...rest} /> */}
			<HamburgerMenu {...rest}>{children}</HamburgerMenu>
		</>
	)
}
