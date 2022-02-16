import React, { useState } from 'react'
import Logo from '../public/Logo.svg'
import Link from 'next/link'
import Modal from './Modal'
import Hamburger from './Hamburger'
import UnderlineButton from './UnderlineButton'
import Login from './Login'

export default function Header() {
	return (
		<header>
			{/* <Modal modalActivator={() => {}}> */}
			<nav className="flex justify-between p-2">
				<Link href="/" passHref>
					<div className="transition-opacity hover:opacity-70 cursor-pointer sm:block hidden">
						<Logo width={82} height={40} />
					</div>
				</Link>
				<Hamburger />
				<ul className="hidden md:flex items-center">
					<li>
						<UnderlineButton>Register</UnderlineButton>
					</li>
					<span className="border mr-2 ml-2 h-3/4 color bg-slate-500" />
					<li>
						<Login />
					</li>
				</ul>
			</nav>

			{/* </div> */}
		</header>
	)
}
