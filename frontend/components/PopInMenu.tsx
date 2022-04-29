import { Dialog } from '@headlessui/react'
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
	return <Dialog.Panel></Dialog.Panel>
}
