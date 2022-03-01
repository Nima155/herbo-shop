import React, { useState } from 'react'
import { ProductAttributes } from '../lib/types'
import Image from 'next/image'
import { imageLoader } from '../lib/helpers'
import Button from './Button'
import { motion } from 'framer-motion'
import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart/react'
import Carousel from './Carousel'
export default function ProductCard({
	productDetails,
}: {
	productDetails: ProductAttributes
}) {
	const [isPressed, setIsPressed] = useState(false)
	const { addItem } = useShoppingCart()
	const price = formatCurrencyString({
		currency: 'USD',
		value: productDetails.price,
	})

	return (
		<div className="flex flex-col p-5 rounded-lg shadow-md gap-1">
			<div className="flex justify-between items-center gap-2">
				<p className="text-slate-700 font-semibold flex-grow-0">
					{productDetails.name}
				</p>
				<p className="rounded-full px-2 py-1 bg-slate-100 border border-slate-200 text-slate-500 font-medium text-sm">
					{price}
				</p>
			</div>
			<Carousel>
				{productDetails.picture.data.map((e, i) => {
					return (
						<Image
							key={i}
							loader={imageLoader}
							src={e.attributes.formats.small.url}
							width={e.attributes.formats.small.width - 200}
							height={e.attributes.formats.small.height - 200}
							alt={productDetails.description}
						/>
					)
				})}
			</Carousel>

			<Button
				className="bg-emerald-500 text-slate-100 px-1 py-2 shadow-md mt-auto gap-2"
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
				onClick={() =>
					addItem({
						currency: 'USD',
						price: productDetails.price,
						name: productDetails.name,
						image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${productDetails.picture.data[0].attributes.formats.small.url}`,
						description: productDetails.description,
						id: productDetails.sku,
					})
				}
			>
				Add to Cart{' '}
			</Button>
		</div>
	)
}
