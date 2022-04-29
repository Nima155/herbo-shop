import { GetServerSideProps } from 'next'
import React from 'react'
import { motion } from 'framer-motion'
import { QueryClient, dehydrate, useQuery, useMutation } from 'react-query'
import Layout from '../../components/Layout'
import { authenticatedGraphQl } from '../../lib/helpers'
import queries from '../../lib/graphql'
import { useForm } from 'react-hook-form'
import InputLabelWrapper from '../../components/Input/InputLabelWrapper'
import Input from '../../components/Input'
import Label from '../../components/Input/Label'
import isEmail from 'validator/lib/isEmail'
import SubmitButton from '../../components/Input/SubmitButton'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { PASSWORD_STRENGTH_OPTIONS } from '../../lib/constants'
import { useToastStore } from '../../components/ToastNotifications'

export default function UpdateProfile() {
	const {
		register: registerPass,
		handleSubmit: handleSubmitPass,
		setError: setErrorPass,
		clearErrors: clearErrorsPass,
		formState: { errors: errorsPass },
		watch: watchPass,
		reset: passReset,
	} = useForm({ reValidateMode: 'onSubmit' })
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({ reValidateMode: 'onSubmit' })

	const { UPDATE_USER } = queries

	const newPassword = watchPass('newPassword')
	const confirmPassword = watchPass('confirmPassword')

	const { data } = useQuery('user_stats')
	const { add: addToast } = useToastStore()

	const mutateUser = useMutation(
		async (data2) => {
			return authenticatedGraphQl().request(UPDATE_USER, {
				id: data.me.id,
				data: data2,
			})
		},
		{
			onSuccess: (successData, variables) => {
				addToast({
					id: `${successData} ${Date.now()}`,
					message: `${
						variables.email ? 'email' : 'password'
					} successfully modified`,
					typ: 'success',
				})
				if (variables.password) {
					passReset()
				}
			},
			onError: (error, variables) => {
				if (variables.email) {
					setError('email', {
						type: 'custom',
						message: error.response.errors[0].message,
					})
				} else {
					setErrorPass('newPassword', {
						type: 'custom',
						message: error.response.errors[0].message,
					})
				}
			},
		}
	)

	const onUserDataSubmit = (d) => {
		const refined = { email: d.email, password: d.newPassword }
		mutateUser.mutate(refined)
	}

	return (
		<Layout>
			<div className="flex flex-col gap-2 items-center">
				<div className="flex flex-col items-center">
					<div className="rounded-full bg-emerald-300 p-5">
						<svg
							id="i-user"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
							width="64"
							height="64"
							fill="white"
							stroke="emerald"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="0.5"
						>
							<path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
						</svg>
					</div>
					<h2 className="font-semibold text-xl mb-4 text-slate-700 border-b-2 border-emerald-500 inline-block">
						{data?.me.username}
					</h2>
				</div>

				<form onSubmit={handleSubmit(onUserDataSubmit)}>
					<InputLabelWrapper>
						<Label htmlFor="email">
							email<span className="text-red-400">*</span>{' '}
						</Label>
						<Input
							id="email"
							{...register('email', {
								required: {
									value: true,
									message: 'Email field cannot be empty',
								},
								validate: (v) => isEmail(v) || 'Invalid email format',
								onChange: () => {
									clearErrors(`email`)
								},
							})}
						/>
					</InputLabelWrapper>
					{errors.email && (
						<span className="text-red-800 text-xs">{errors.email.message}</span>
					)}
					<SubmitButton className="mt-2 w-full rounded-sm capitalize">
						update email
					</SubmitButton>
				</form>

				<form
					onSubmit={handleSubmitPass(onUserDataSubmit)}
					className="flex justify-evenly flex-col gap-4 mt-8 "
				>
					{/* <InputLabelWrapper>
						<Label htmlFor="current-password">
							current password<span className="text-red-400">*</span>
						</Label>
						<Input
							type="password"
							id="current-password"
							{...registerPass('currentPassword', {
								required: {
									value: true,
									message: 'Missing current password',
								},
							})}
						/>
						{errorsPass.currentPassword && (
							<span className="text-red-800 text-xs">
								{errorsPass.currentPassword.message}
							</span>
						)}
					</InputLabelWrapper> */}
					<InputLabelWrapper>
						<Label htmlFor="new-password">
							new password<span className="text-red-400">*</span>
						</Label>
						<Input
							type="password"
							autoComplete="new-password"
							id="new-password"
							{...registerPass('newPassword', {
								validate: (v) => isStrongPassword(v, PASSWORD_STRENGTH_OPTIONS),

								required: { value: true, message: 'Missing new password' },
							})}
						/>
						{errorsPass.newPassword && (
							<span className="text-red-800 text-xs overflow-hidden">
								{errorsPass.newPassword.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor="confirm-password">
							confirm password<span className="text-red-400">*</span>
						</Label>
						<Input
							type="password"
							id="confirm-password"
							{...registerPass('confirmPassword', {
								required: true,
								validate: (v) => v == newPassword || 'Passwords do not match',
								onChange: () => {
									clearErrorsPass('confirmPassword')
								},
							})}
						/>
						{errorsPass.confirmPassword && (
							<span className="text-red-800 text-xs">
								{errorsPass.confirmPassword.message}
							</span>
						)}
					</InputLabelWrapper>

					<ul
						className={`flex-col gap-1 -mb-4 ${
							newPassword ? 'flex' : 'h-0'
						} overflow-hidden`}
					>
						<li>
							{newPassword?.length >= 8 ? '✔️' : '❌'} must be at least 8
							characters long{' '}
						</li>
						<li>
							{/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)
								? '✔️'
								: '❌'}{' '}
							must contain at least 1 lowercase letter and 1 capital letter
						</li>
						<li>
							{/\d/.test(newPassword) ? '✔️' : '❌'} must contain at least 1
							digit
						</li>
						<li>
							{newPassword === confirmPassword ? '✔️' : '❌'} confirm password
							matches new password
						</li>
					</ul>

					<SubmitButton className="mt-2 w-full rounded-sm capitalize">
						update password
					</SubmitButton>
				</form>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gqlClient = authenticatedGraphQl(context.req.cookies)

	const queryClient = new QueryClient()
	const { USER_INFO } = queries

	// console.log(products.products.data[0].attributes.picture.data[0].attributes)
	await queryClient.prefetchQuery('user_stats', async () => {
		return gqlClient.request(USER_INFO)
	})

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	}
}
