import request from 'graphql-request'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Layout from '../components/Layout'
import LoadingDots from '../components/LoadingDots'
import queries from '../lib/graphql'
export default function EmailConfirmation({
	confirmation,
}: {
	confirmation?: string
}) {
	const queryClient = useQueryClient()
	const router = useRouter()
	const mutation = useMutation(
		async () => {
			const data = await request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				queries.CONFIRM_EMAIL,
				{
					confirmation,
				}
			)
			return data
		},
		{
			onSuccess: (data) => {
				queryClient.setQueryData('user_stats', {
					me: data.emailConfirmation.user,
				})
				setTimeout(() => {
					router.push('/')
				}, 5000)
			},
		}
	)

	useEffect(() => {
		mutation.mutate()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Layout>
			<div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9/12 text-center">
				{(mutation.isLoading || (!mutation.isSuccess && !mutation.isError)) && (
					<LoadingDots />
				)}
				{mutation.isSuccess && (
					<p>
						We have successfully verified your account. You will be redirected
						to our homepage in 5 seconds.
					</p>
				)}
				{mutation.isError && (
					<p>Unfortunately, we could not verify your account.</p>
				)}
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { confirmation } = context.query

	return {
		props: { confirmation },
	}
}
