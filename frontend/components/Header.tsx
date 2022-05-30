import React, { forwardRef, useEffect, useState } from 'react'
import Logo from '../public/Logo.svg'
import Hamburger from './Hamburger'
import Login from './Login'
import useUser from '../lib/useUser'
import queries from '../lib/graphql'
import styled from 'styled-components'
import { Menu, Popover, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from 'react-query'
import { authenticatedGraphQl } from '../lib/helpers'
import Register from './Register'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart'

import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'

// eslint-disable-next-line react/display-name
const MyLink = forwardRef((props: any, ref) => {
	let { href, children, ...rest } = props
	return (
		<Link href={href}>
			<a ref={ref} {...rest}>
				{children}
			</a>
		</Link>
	)
})

function CartButton() {
	const { cartCount } = useShoppingCart()

	return (
		<>
			{/* <Toast /> */}

			<Link href={'/cart'} passHref>
				<div className="relative cursor-pointer self-end">
					<p className="absolute z-10 bg-emerald-700 bg-opacity-80 rounded-full h-5 w-5 text-slate-100 flex items-center text-xs justify-center -top-2 -right-2">
						{cartCount}
					</p>
					<Image src="/basket.svg" height={25} width={25} alt="Basket" />
				</div>
			</Link>
		</>
	)
}

const StyledAnchor = styled.a.attrs<{ className: string }>((props) => ({
	className: `hover:text-emerald-700 ${props.className}`,
}))``

let didScroll = false
let lastY = 0

export default function Header() {
	const { user } = useUser()
	const queryClient = useQueryClient()
	const router = useRouter()
	const logoutMutation = useMutation(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			await authenticatedGraphQl().request(queries.LOGOUT)
		},
		{
			onSuccess: () => {
				queryClient.removeQueries('user_stats', { exact: true })
				queryClient.removeQueries('user_addresses', { exact: true })
				router.push('/')
			},
		}
	)
	const [hide, setHide] = useState(false)

	useEffect(() => {
		function handleScroll(event: Event) {
			didScroll = true
		}

		window.addEventListener('scroll', handleScroll, false)

		const interval = setInterval(() => {
			if (didScroll) {
				if (lastY < window.scrollY) {
					setHide(true)
				} else {
					setHide(false)
				}
				lastY = window.scrollY

				didScroll = false
			}
		}, 250)

		return () => {
			window.removeEventListener('scroll', handleScroll, false)
			clearInterval(interval)
		}
	}, [])

	return (
		<>
			<motion.header
				className={`px-5 py-2 max-w-screen-xl -translate-x-1/2 left-1/2 fixed top-0 z-30 w-full bg-slate-100`}
				animate={{ top: hide ? -300 : 0 }}
			>
				{/* <Modal modalActivator={() => {}}> */}
				<Hamburger />
				<nav className="flex py-1 items-end justify-end sm:justify-between">
					<Link href="/" passHref scroll={false}>
						<a className="transition-opacity hover:opacity-70 cursor-pointer">
							<Logo width={82} height={40} />
						</a>
					</Link>

					{!user?.me ? (
						<ul className="hidden sm:flex items-center">
							<li>
								<Register />
							</li>

							<li>
								<Login />
							</li>
						</ul>
					) : (
						<div className="relative flex gap-5 top-2 flex-row justify-end">
							<CartButton />
							<Link
								href="/current-account/update-profile"
								passHref
								scroll={false}
							>
								<StyledAnchor className="sm:hidden">
									<Image
										src={'/profile.svg'}
										height={25}
										width={25}
										alt={'chevron point to the left'}
									/>
								</StyledAnchor>
							</Link>

							<Popover>
								<Popover.Button className="hover:text-emerald-700 transition-colors ease-linear sm:flex flex-col hidden">
									<Image
										src={'/profile.svg'}
										height={25}
										width={25}
										alt={'chevron point to the left'}
									/>
									<span className="hidden sm:inline w-24 overflow-hidden text-ellipsis whitespace-nowrap">
										{user.me.username}
									</span>
								</Popover.Button>

								<Transition
									enter="transition duration-100 ease-out"
									enterFrom="transform scale-95 opacity-0"
									enterTo="transform scale-100 opacity-100"
									leave="transition duration-75 ease-out"
									leaveFrom="transform scale-100 opacity-100"
									leaveTo="transform scale-95 opacity-0"
								>
									<Popover.Panel className="absolute z-10 -left-6 sm:left-3 p-2 overflow-hidden rounded-md border shadow-md shadow-emerald-200 bg-slate-100">
										<div className="flex flex-col gap-2 text-sm capitalize">
											<Popover.Button
												as={MyLink}
												href="/current-account/update-profile"
												passHref
												scroll={false}
											>
												<StyledAnchor>Profile</StyledAnchor>
											</Popover.Button>
											<Popover.Button
												as={MyLink}
												href="/current-account/address-details"
												passHref
												scroll={false}
											>
												<StyledAnchor>Shipping</StyledAnchor>
											</Popover.Button>
											<Popover.Button
												href="/current-account/orders"
												passHref
												scroll={false}
												as={MyLink}
											>
												<StyledAnchor>Orders</StyledAnchor>
											</Popover.Button>
											<button
												className="self-start hover:text-emerald-600"
												onClick={logoutMutation.mutate}
											>
												{/* logout button */}logout
											</button>
										</div>
										{/* <img src="/solutions.jpg" alt="" /> */}
									</Popover.Panel>
								</Transition>
							</Popover>
						</div>
					)}
				</nav>

				{/* </div> */}
			</motion.header>
		</>
	)
}
