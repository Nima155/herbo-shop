import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
const BUTTON_STYLING =
	'p-2 flex items-center rounded-full hover:bg-slate-200  transition-colors duration-75 ease-in absolute'
export default function Carousel({ children }: { children: React.ReactNode }) {
	const maxLength = React.Children.count(children)
	const childrenToArray = React.Children.toArray(children)
	const divRef = useRef<HTMLDivElement>(null)
	const [curIndex, setCurIndex] = useState(0)

	return (
		<motion.div
			className="flex items-center justify-center relative"
			ref={divRef}
		>
			{childrenToArray.length > 1 && (
				<button
					onClick={() => {
						setCurIndex((c) => (c > 0 ? c - 1 : maxLength - 1) % maxLength)
					}}
					className={`${BUTTON_STYLING} left-0 z-10`}
				>
					<Image
						src={'/chevron-left.svg'}
						height={25}
						width={25}
						alt={'chevron point to the left'}
					/>
				</button>
			)}

			{childrenToArray[curIndex]}

			{childrenToArray.length > 1 && (
				<button
					onClick={() => {
						setCurIndex((c) => (c + 1) % maxLength)
					}}
					className={`${BUTTON_STYLING} right-0 z-10`}
				>
					<Image
						src={'/chevron-right.svg'}
						height={25}
						width={25}
						alt={'chevron point to the right'}
					/>
				</button>
			)}
		</motion.div>
	)
}
