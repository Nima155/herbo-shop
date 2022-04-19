import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { motion } from 'framer-motion'
const CustomBoldPara = styled.p.attrs((props) => ({
	className: 'text-slate-700 font-semibold',
}))``
const VerticalFlex = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
`

function OrderItem({ orderItem }: { orderItem: any }) {
	const { attributes } = orderItem
	// console.log(attributes.product.data.attributes)

	// `${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${productDetails.picture.data[0].attributes.formats.small.url}`
	return (
		<motion.div
			style={{ minWidth: 150 }}
			className="pointer-events-none relative"
		>
			<Image
				width={150}
				height={150}
				src={`${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${attributes.product.data.attributes.picture.data[0].attributes.formats.small.url}`}
				alt={'picture of the product'}
			/>
			<div className="absolute top-0 right-0 bg-emerald-700  text-slate-100 h-5 w-5 rounded-bl-md opacity-50 text-xs flex justify-center items-center">
				<p className="text-ellipsis  overflow-hidden whitespace-nowrap">
					{attributes.quantity}
				</p>
			</div>
		</motion.div>
	)
}

export default function Order({ order }: { order: any }) {
	const caroRef = useRef(null)

	return (
		<div className="p-2 max-w-xl">
			<div className="flex gap-2 items-center border-b border-b-slate-300 justify-evenly">
				<VerticalFlex>
					<CustomBoldPara>Status</CustomBoldPara>
					<p className="text-slate-500 capitalize">{order.attributes.status}</p>
				</VerticalFlex>
				<VerticalFlex>
					<CustomBoldPara>Placed On</CustomBoldPara>
					<p className="text-slate-500 ">
						{order.attributes.createdAt.split('T')[0]}
					</p>
				</VerticalFlex>
				<VerticalFlex>
					<CustomBoldPara>Sum Total</CustomBoldPara>
					<p className="text-slate-500 ">${order.attributes.total_cost}</p>
				</VerticalFlex>
			</div>
			<motion.div className="overflow-hidden " ref={caroRef}>
				<motion.div
					className={`flex mt-2 gap-1 cursor-grab`}
					style={{ width: 'max-content' }}
					drag="x"
					dragConstraints={caroRef}
				>
					{order.attributes.order_lists.data.map((e, i) => (
						<OrderItem key={i} orderItem={e} />
					))}
				</motion.div>
			</motion.div>
		</div>
	)
}
