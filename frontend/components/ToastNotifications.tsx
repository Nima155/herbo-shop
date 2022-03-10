import produce from 'immer'
import create from 'zustand'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import ReactDOM from 'react-dom'
import React from 'react'
import Image from 'next/image'
import Button from './Button'

type ToastItem = {
	id: string
	message: string
	typ: Status
}

type ToastStorage = {
	toasts: Array<ToastItem>
	autoRemove: (id: string) => void
	remove: (id: string) => void
	add: (toastItem: ToastItem) => void
}
const NOTIFICATION_LIFE_TIME = 3500
export const useToastStore = create<ToastStorage>((set, get) => ({
	toasts: new Array(),
	autoRemove: (id) =>
		setTimeout(() => {
			set(
				produce((state) => {
					state.toasts = state.toasts.filter((e) => e.id !== id)
				})
			)
		}, NOTIFICATION_LIFE_TIME),
	add: (toastItem: ToastItem) =>
		set(
			produce((state) => {
				state.toasts.push(toastItem)
				get().autoRemove(toastItem.id)
			})
		),
	remove: (id) =>
		set(
			produce((state) => {
				state.toasts = state.toasts.filter((e) => e.id !== id)
			})
		),
}))
type Status = 'warning' | 'info' | 'error' | 'success'
const TYPES = {
	success: 'bg-green-500',
	error: 'bg-red-500',
	info: 'bg-blue-500',
	warning: 'bg-yellow-500',
}

const Toast = (props: {
	children?: React.ReactNode
	id: string
	options?: {
		status?: Status
	}
}) => {
	const { remove, toasts } = useToastStore()

	const { id, options: { status = 'info' } = { status: 'info' } } = props

	// return ReactDOM.createPortal(

	return (
		<motion.li
			layout
			key={props.id}
			initial={{ opacity: 0, y: 50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
			className={`${TYPES[status]}   px-2 py-3 sm:py-5 text-slate-100 rounded-lg flex gap-2 relative overflow-hidden`}
		>
			{/* <AnimatePresence> */}
			<motion.span
				initial={{ scaleX: 0, originX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{
					duration: NOTIFICATION_LIFE_TIME / 1000,
					ease: 'linear',
				}}
				className="inline-block absolute left-0 bg-black/30 top-0 h-2 w-full"
			/>
			{/* </AnimatePresence> */}

			<Button
				onClick={() => remove(props.id)}
				className="rounded-full bg-emerald-700/70 h-6 w-6"
			>
				{' '}
				<Image
					src={'/cross.svg'}
					height={10}
					width={10}
					alt={'cross sign'}
				/>{' '}
			</Button>
			<div
				style={{ width: '12.5rem' }}
				className="relative overflow-hidden whitespace-nowrap text-ellipsis inline-block px-2"
			>
				{props.children}
			</div>
		</motion.li>
	)
	// document.getElementById('toastContainer')!
	// )
}
export default Toast
