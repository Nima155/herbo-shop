import React, { useState } from 'react'
import Modal from './Modal'
import { UnderlineButton } from './UnderlinedComponents'
import InputLabelWrapper from './Input/InputLabelWrapper'
import Label from './Input/Label'
import Input from './Input'
import queries from '../lib/graphql/index'
import SubmitButton from './Input/SubmitButton'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import validator from 'validator'
import { useMutation } from 'react-query'
import Image from 'next/image'
import request from 'graphql-request'
import LoadingDots from './LoadingDots'

type RegistrationForm = {
	username: string
	email: string
	password: string
	confirmPassword: string
}
const PASSWORD_STRENGTH_OPTIONS: validator.strongPasswordOptions = {
	minNumbers: 1,
	minLength: 8,
	minLowercase: 1,
	minUppercase: 1,
	minSymbols: 0,
}

export default function Register() {
	const [modalStatus, setModalStatus] = useState(false)

	const {
		handleSubmit,
		register,
		setError,
		formState: { errors },
		clearErrors,
		watch,
	} = useForm<RegistrationForm>({ reValidateMode: 'onSubmit' })

	const mutation = useMutation(
		async ({ password, username, email }: RegistrationForm) => {
			const { id } = await fetch('/api/create-customer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})
				.then((res) => {
					if (!res.ok) throw Error('Failed to create customer_id')
					return res.json()
				})
				.catch((e) => {})

			await request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				queries.REGISTER,
				{
					password,
					username,
					email,
					stripeId: id,
				}
			)
		},
		{
			onError: (e: any) => {
				if (e?.response?.errors[0]?.message.toLowerCase().includes('email')) {
					setError('email', { message: e?.response?.errors[0].message })
				} else {
					setError('username', { message: 'Username already taken' })
				}
			},
		}
	)

	const currentPasswordValue = watch('password')

	const onSubmit = (data: RegistrationForm) => {
		mutation.mutate(data)
	}

	return (
		<div>
			<UnderlineButton onClick={() => setModalStatus(true)}>
				Register
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
				{mutation.isSuccess ? (
					<div className="flex flex-col gap-2 justify-center items-center max-w-xs text-center">
						<Image
							src="/green-tick.svg"
							height={50}
							width={50}
							alt="A tick indicating success"
						/>
						Welcome, you should now confirm your account by clicking on the link
						in the email that we just sent you!
					</div>
				) : (
					<>
						{mutation.isLoading && <LoadingDots />}
						<form
							className="flex gap-2 flex-col"
							onSubmit={handleSubmit(onSubmit)}
							style={{ maxWidth: '236px' }}
						>
							<InputLabelWrapper>
								<Label htmlFor="username">username</Label>
								<Input
									type="text"
									id="username"
									{...register('username', {
										required: {
											value: true,
											message: 'Username is required',
										},
										onChange: () => {
											clearErrors('username')
										},
									})}
									autoComplete="off"
								/>
								{errors.username && (
									<span className="text-red-800 text-xs">
										{errors.username.message}
									</span>
								)}
							</InputLabelWrapper>
							<InputLabelWrapper>
								<Label htmlFor="email">email</Label>
								<Input
									type="email"
									id="email"
									{...register('email', {
										required: {
											value: true,
											message: 'Email is required',
										},
										onChange: () => {
											clearErrors('email')
										},
										validate: (v) => isEmail(v) || 'Invalid email',
									})}
								/>
								{errors.email && (
									<span className="text-red-800 text-xs">
										{errors.email.message}
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
										validate: (v) => {
											return (
												isStrongPassword(v, PASSWORD_STRENGTH_OPTIONS) ||
												'Password must consist of at least 1 uppercase letter, 1 number, 1 lowercase letter, and be no shorter than 8 characters in length'
											)
										},
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
							<InputLabelWrapper>
								<Label htmlFor="confirm-password">confirm password</Label>
								<Input
									type="password"
									id="confirm-password"
									{...register('confirmPassword', {
										required: true,
										validate: (v) =>
											v == currentPasswordValue || 'Passwords do not match',
										onChange: () => {
											clearErrors('confirmPassword')
										},
									})}
								/>
								{errors.confirmPassword && (
									<span className="text-red-800 text-xs">
										{errors.confirmPassword.message}
									</span>
								)}
							</InputLabelWrapper>

							<SubmitButton type="submit">Join us</SubmitButton>
						</form>
					</>
				)}
			</Modal>
		</div>
	)
}
