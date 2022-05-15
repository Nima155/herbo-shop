import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment, useState } from 'react'
import ReactDOM from 'react-dom'
import create from 'zustand'

import PopInMenu from './PopInMenu'

export const useToggle = create<{
	toggled: boolean
	toggle: (_?: boolean) => void
}>((set) => ({
	toggled: false,

	toggle: (targetState) => {
		set((state) => ({
			toggled: targetState !== undefined ? targetState : !state.toggled,
		}))
	},
}))

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
function HamburgerMenu() {
	const { toggled, toggle } = useToggle()
	// fixed z-10 inset-0 overflow-y-auto
	return (
		<AnimatePresence>
			{toggled && (
				<Dialog
					open={toggled}
					onClose={() => {
						toggle(false)
					}}
					static
					as={motion.div}
					className="fixed top-0 overflow-y-auto w-1/2 max-w-xs bg-slate-100 h-screen border-0
							   flex flex-col gap-3 sm:hidden z-30 overflow-x-hidden"
					style={{ minWidth: '16rem' }}
					variants={MENU_TRANSITION}
					initial="initial"
					animate="animate"
					exit={{ x: '-100vw', opacity: 0 }}
					transition={{
						staggerChildren: 0.3,
						type: 'tween',
						when: 'beforeChildren',
					}}
				>
					<MenuToggle />
					<Dialog.Backdrop
						className="fixed inset-0 bg-black opacity-30 z-30"
						as={motion.div}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.3 }}
						exit={{ opacity: 0 }}
					/>

					<PopInMenu />
				</Dialog>
			)}
		</AnimatePresence>
	)
}

const Path = (props: any) => (
	<motion.path
		fill="transparent"
		strokeWidth="3"
		stroke="hsl(0, 0%, 18%)"
		strokeLinecap="round"
		{...props}
	/>
)

const MenuToggle = () => {
	const { toggled, toggle } = useToggle()

	return (
		<button
			onClick={(e) => {
				toggle()
			}}
			className="top-6 left-6 sm:hidden fixed z-50"
		>
			<svg width="23" height="23" viewBox="0 0 23 23">
				<Path
					animate={{ d: toggled ? 'M 3 16.5 L 17 2.5' : 'M 2 2.5 L 20 2.5' }}
				/>
				<Path
					d="M 2 9.423 L 20 9.423"
					animate={{ opacity: toggled ? 0 : 1 }}
					transition={{ duration: 0.1 }}
				/>
				<Path
					animate={{
						d: toggled ? 'M 3 2.5 L 17 16.346' : 'M 2 16.346 L 20 16.346',
					}}
				/>
			</svg>
		</button>
	)
}

export default function Hamburger() {
	return (
		<>
			<MenuToggle />
			<HamburgerMenu />
		</>
	)
}
