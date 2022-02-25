import React from 'react'
import Header from './Header'

export default function Layout({
	children,
	twStyles,
}: {
	children?: React.ReactNode
	twStyles?: string
}) {
	return (
		<div className={`p-5 max-w-screen-xl mx-auto`}>
			<Header />
			<main className={twStyles}>{children}</main>
		</div>
	)
}
