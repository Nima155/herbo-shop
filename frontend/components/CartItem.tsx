import React, { useRef, useEffect, useLayoutEffect } from 'react'
import { useShoppingCart } from 'use-shopping-cart/react'
import Image from 'next/image'

import { motion } from 'framer-motion'
// import styled from 'styled-components'

export default function CartItem({ productId }: { productId: string }) {
	const { incrementItem, decrementItem, cartDetails } = useShoppingCart()

	const productDetails = cartDetails[productId]

	return (
		<motion.div
			initial={{
				height: 132,
				opacity: 1,
			}} /* change height to something dynamic */
			exit={{ height: 0 }}
			key={productId}
			// className="border border-red-500"
		>
			{productDetails && (
				<div className="flex gap-2 p-2 border-t bg-white last:border-b">
					{' '}
					{
						<Image
							src={productDetails?.image}
							alt={productDetails?.description}
							width={114}
							height={114}
						/>
					}
					<div className="flex flex-col flex-grow">
						<h3 className="font-semibold text-slate-700">
							{' '}
							{productDetails?.name}
						</h3>
						<p className="text-sm font-medium text-slate-500">Qty:</p>
						<div className="flex items-center mt-4 ml-8">
							<button
								onClick={() => decrementItem(productDetails?.id)}
								className="mr-2 h-6 w-6 border rounded-full flex items-center justify-center hover:border-red-500 transition-colors ease-in"
							>
								{productDetails?.quantity > 1 ? (
									<Image
										src="/minus.svg"
										alt="minus sign"
										height={15}
										width={15}
									/>
								) : (
									<Image src="/bin.svg" alt="bin" height={15} width={15} />
								)}
							</button>
							<p>{productDetails?.quantity}</p>
							<button
								onClick={() => incrementItem(productDetails?.id)}
								className="ml-2 border h-6 w-6 flex items-center justify-center hover:border-emerald-500 transition-colors ease-in rounded-full"
							>
								<Image src="/plus.svg" alt="plus sign" height={15} width={15} />
							</button>
						</div>
					</div>
					{/* <div className="w-40 h-40 max-w-xs max-h-80 relative block"> */}
					{/* </div> */}
				</div>
			)}
		</motion.div>
	)
}
