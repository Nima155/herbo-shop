import React, { useState } from 'react'
import { ProductAttributes } from '../lib/types'
import Image from 'next/image'
import { imageLoader } from '../lib/helpers'
import Button from './Button'
export default function ProductCard({
	productDetails,
}: {
	productDetails: ProductAttributes
}) {
	const [isPressed, setIsPressed] = useState(false)

	return (
		<div className="flex flex-col p-5 rounded-lg shadow-md gap-1">
			<p className="rounded-full p-2 bg-slate-100 self-start border border-slate-400 tracking-wide text-slate-600">
				${productDetails.price / 100}
			</p>
			<Image
				loader={imageLoader}
				src={productDetails.picture.data[0].attributes.formats.small.url}
				width={
					productDetails.picture.data[0].attributes.formats.small.width - 200
				}
				height={
					productDetails.picture.data[0].attributes.formats.small.height - 200
				}
				alt={productDetails.description}
			/>
			<Button
				className="bg-emerald-500 text-slate-100 px-1 py-1 shadow-md gap-1"
				whileTap={{ scale: 0.96 }}
				whileHover={{ scale: 1.08 }}
				animate={isPressed ? { scale: 0.96 } : { scale: 1 }}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						setIsPressed(false)
					}
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						setIsPressed(true)
					}
				}}
			>
				Add to basket{' '}
				<Image src="/basket.svg" height={15} width={15} alt="Basket" />
			</Button>
		</div>
	)
}
