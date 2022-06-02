import React, { forwardRef, useEffect, useState } from 'react'
import Logo from '../public/Logo.svg'
import Hamburger, { useToggle } from './Hamburger'
import Login from './Login'
import useUser from '../lib/useUser'
import queries from '../lib/graphql'
import styled from 'styled-components'
import { Dialog, Menu, Popover, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from 'react-query'
import { authenticatedGraphQl } from '../lib/helpers'
import Register from './Register'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart'

import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Path from './Path'

const MAIN_MENU_TRANSITION = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,

		transition: {
			delayChildren: 0.2,
			staggerChildren: 0.1,
		},
	},
}
const MENU_TRANSITION = {
	initial: {
		x: '-100vw',
		opacity: 0,
	},
	animate: {
		opacity: 1,
		x: 0,
	},
	exit: {
		x: '-100vw',
		opacity: 0,
	},
}

const HamburgerButton = () => {
	const { toggle, toggled } = useToggle()
	const toggledId = toggled[0]
	return (
		<button
			onClick={() => {
				toggle(0)
			}}
			className="top-6 left-6 sm:hidden fixed z-50"
		>
			<svg width="23" height="23" viewBox="0 0 23 23">
				<Path
					animate={{
						d: toggledId ? 'M 3 16.5 L 17 2.5' : 'M 2 2.5 L 20 2.5',
					}}
				/>
				<Path
					d="M 2 9.423 L 20 9.423"
					animate={{ opacity: toggledId ? 0 : 1 }}
					transition={{ duration: 0.1 }}
				/>
				<Path
					animate={{
						d: toggledId ? 'M 3 2.5 L 17 16.346' : 'M 2 16.346 L 20 16.346',
					}}
				/>
			</svg>
		</button>
	)
}

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
				<HamburgerButton />
				<Hamburger
					variants={MENU_TRANSITION}
					id={0}
					className="fixed top-0 overflow-y-auto w-1/2 max-w-xs bg-slate-100 h-screen border-0
					flex flex-col gap-3 sm:hidden z-30 overflow-x-hidden"
				>
					{(anchorTransition) => (
						<Dialog.Panel className="h-full w-full pt-16">
							<motion.div
								className="flex flex-col gap-5 capitalize items-center justify-center pt-20 text-xl"
								variants={MAIN_MENU_TRANSITION}
								initial="initial"
								animate="animate"
							>
								<HamburgerButton />
								<Link
									href="/current-account/update-profile"
									passHref
									scroll={false}
								>
									<motion.a variants={anchorTransition}>Profile</motion.a>
								</Link>
								<Link
									href="/current-account/address-details"
									passHref
									scroll={false}
								>
									<motion.a variants={anchorTransition}>Shipping</motion.a>
								</Link>
								<Link href="/current-account/orders" passHref scroll={false}>
									<motion.a variants={anchorTransition}>Orders</motion.a>
								</Link>
								<motion.button
									className="hover:text-emerald-600 transition-colors"
									variants={anchorTransition}
									// onClick={logoutMutation.mutate}
								>
									{/* logout button */}logout
								</motion.button>
							</motion.div>
						</Dialog.Panel>
					)}
				</Hamburger>
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
