import React, { useState } from 'react'
import { UnderlineButton } from './UnderlinedComponents'
import Modal from './Modal'
import Input from './Input'
import Label from './Input/Label'
import InputLabelWrapper from './Input/InputLabelWrapper'
import { useForm, SubmitHandler } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import useUser from '../lib/useUser'
import { useMutation } from 'react-query'
import queries from '../lib/graphql'
import request from 'graphql-request'
import { Dialog } from '@headlessui/react'
import Image from 'next/image'
import SubmitButton from './Input/SubmitButton'
import LoadingDots from './LoadingDots'

type LoginFormData = {
	ident: string
	password: string
}

function ForgotPassword({ statusFlipper }: { statusFlipper: () => void }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<{ email: string }>({ reValidateMode: 'onSubmit' })

	const forgotMutation = useMutation(
		async (email: string) => {
			const ok = await request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				queries.FORGOT_PASSWORD,
				{ email }
			)

			return ok
		},
		{
			onError: (errors) => {
				setError('email', {
					message: errors.response.errors[0].message,
				})
			},
		}
	)

	const onSubmit: SubmitHandler<{ email: string }> = ({ email }) => {
		forgotMutation.mutate(email)
	}
	// console.log(forgotMutation.isLoading)

	return (
		<div className="flex flex-col items-center gap-4">
			<Dialog.Title className="text-lg text-center font-semi-bold">
				Forgot password
			</Dialog.Title>
			{forgotMutation.isLoading && <LoadingDots />}
			{forgotMutation.isSuccess ? (
				<div className="flex flex-col gap-2 justify-center items-center max-w-xs text-center">
					<Image
						src="/green-tick.svg"
						height={50}
						width={50}
						alt="A tick indicating success"
					/>
					Use the link that we have just mailed you in order to change your
					password
				</div>
			) : (
				<div className="relative">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="relative flex flex-col gap-2"
					>
						<InputLabelWrapper>
							<Label htmlFor="email">email</Label>
							<Input
								type="email"
								id="email"
								{...register('email', {
									validate: (v) => isEmail(v) || 'Invalid email format',
									required: true,
									onChange: () => {
										clearErrors('email')
									},
								})}
								autoFocus
							/>
						</InputLabelWrapper>
						{errors.email && (
							<span className="text-red-800 text-xs">
								{errors.email.message}
							</span>
						)}
						<SubmitButton type="submit">Submit</SubmitButton>
					</form>
					<button
						className="text-xs text-gray-500 hover:text-gray-900 focus:text-gray-900 self-start transition-colors duration-75 ease-in"
						onClick={statusFlipper}
						type="button"
					>
						Cancel
					</button>
				</div>
			)}
		</div>
	)
}

export default function Login() {
	const [modalStatus, setModalStatus] = useState(false)
	const [forgotPasswordIsOpen, setForgotPasswordIsOpen] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<LoginFormData>({ reValidateMode: 'onSubmit' })
	const { user, loginUser } = useUser()
	// console.log(user)

	const onSubmit: SubmitHandler<LoginFormData> = ({ ident, password }) => {
		loginUser.mutate({
			identifier: ident,
			password,
		})
		if (loginUser.isError) {
			setError('password', { message: 'Invalid password or username/email' })
		}
	}

	return (
		<div>
			<UnderlineButton onClick={() => setModalStatus(true)}>
				Login
			</UnderlineButton>
			<Modal
				modalIsOpen={modalStatus}
				modalSetter={() => setModalStatus(false)}
				twStyles="px-6 py-6 bg-white rounded-md flex justify-center mx-auto relative"
				twVariants={{
					hidden: {
						y: 20,
						opacity: 0,
					},
					visible: {
						y: 0,
						opacity: 1,
					},
				}}
			>
				{!forgotPasswordIsOpen ? (
					<div className="flex flex-col items-center gap-4">
						{loginUser.isLoading && <LoadingDots />}
						<Dialog.Title className="text-lg text-center font-semi-bold">
							Get back into things!
						</Dialog.Title>
						<form
							className="flex gap-2 flex-col"
							onSubmit={handleSubmit(onSubmit)}
						>
							<InputLabelWrapper>
								<Label htmlFor="identifier">username/email</Label>
								<Input
									type="text"
									id="identifier"
									{...register('ident', {
										required: {
											value: true,
											message: 'Missing email/username',
										},
										onChange: () => {
											clearErrors('ident')
										},
									})}
									autoComplete="off"
								/>
								{errors.ident && (
									<span className="text-red-800 text-xs">
										{errors.ident.message}
									</span>
								)}
							</InputLabelWrapper>
							<InputLabelWrapper>
								<Label htmlFor="password">password</Label>
								<Input
									type="password"
									id="password"
									{...register('password', {
										required: true,
										onChange: () => {
											clearErrors('password')
										},
									})}
								/>
								{errors.password && (
									<span className="text-red-800 text-xs">
										{errors.password.message}
									</span>
								)}
							</InputLabelWrapper>

							<SubmitButton type="submit">Login</SubmitButton>
							<button
								className="text-xs text-gray-500 hover:text-gray-900 focus:text-gray-900 self-start transition-colors duration-75 ease-in"
								onClick={() => setForgotPasswordIsOpen((c) => !c)}
								type="button"
							>
								Forgot your password?
							</button>
						</form>
					</div>
				) : (
					<ForgotPassword
						statusFlipper={() => setForgotPasswordIsOpen((c) => !c)}
					/>
				)}
			</Modal>
		</div>
	)
}
