import React from 'react'
import Logo from '../public/Logo.svg'
import Hamburger from './Hamburger'
import Login from './Login'
import useUser from '../lib/useUser'
import queries from '../lib/graphql'
import styled from 'styled-components'
import { Popover, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from 'react-query'
import { authenticatedGraphQl } from '../lib/helpers'
import Register from './Register'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart/react'
import Link from 'next/link'

function CartButton() {
	const { cartCount, redirectToCheckout } = useShoppingCart()
	return (
		<Link href={'/cart'} passHref>
			<div className="relative cursor-pointer">
				<p className="absolute z-10 bg-emerald-700 bg-opacity-80 rounded-full h-5 w-5 text-slate-100 flex items-center text-xs justify-center -top-2 -right-2">
					{cartCount}
				</p>
				<Image src="/basket.svg" height={25} width={25} alt="Basket" />
			</div>
		</Link>
	)
}

const StyledAnchor = styled.a.attrs({
	className: 'hover:text-emerald-700',
})``
export default function Header() {
	const { user } = useUser()
	const queryClient = useQueryClient()

	const logoutMutation = useMutation(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			await authenticatedGraphQl().request(queries.LOGOUT)
		},
		{
			onSuccess: () => {
				queryClient.removeQueries('user_stats', { exact: true })
			},
		}
	)

	return (
		<header>
			{/* <Modal modalActivator={() => {}}> */}
			<nav className="flex justify-between p-2 items-center">
				<Link href="/" passHref>
					<a className="transition-opacity hover:opacity-70 cursor-pointer sm:block hidden">
						<Logo width={82} height={40} />
					</a>
				</Link>
				<Hamburger />

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
					<div className="relative hidden sm:flex sm:gap-5">
						<CartButton />
						<Popover>
							<Popover.Button className="hover:text-emerald-700 transition-colors ease-linear">
								{user.me.username}
							</Popover.Button>
							<Transition
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0"
							>
								<Popover.Panel className="absolute z-10 p-2 overflow-hidden rounded-md border shadow-md shadow-emerald-200 bg-slate-100">
									<div className="flex flex-col gap-2 text-sm capitalize">
										<Link href="/current-account/update-profile" passHref>
											<StyledAnchor>Profile</StyledAnchor>
										</Link>
										<Link href="/current-account/address-details" passHref>
											<StyledAnchor>Shipping</StyledAnchor>
										</Link>
										<Link href="/current-account/orders" passHref>
											<StyledAnchor>Orders</StyledAnchor>
										</Link>
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
		</header>
	)
}
