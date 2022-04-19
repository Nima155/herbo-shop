import { GetServerSideProps } from 'next'
import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import Label from '../components/Input/Label'
import InputLabelWrapper from '../components/Input/InputLabelWrapper'
import Layout from '../components/Layout'
import SubmitButton from '../components/Input/SubmitButton'
import request from 'graphql-request'
import queries from '../lib/graphql'
import { useMutation } from 'react-query'
import LoadingDots from '../components/LoadingDots'
import { useRouter } from 'next/router'
import Image from 'next/image'
interface IResetPassword {
	newPassword: string
	confirmNewPassword: string
}

export default function ResetPassword({ code }: { code: string }) {
	const {
		clearErrors,
		handleSubmit,
		register,
		watch,
		formState: { errors },
		setError,
	} = useForm<IResetPassword>({ reValidateMode: 'onSubmit' })
	const router = useRouter()
	const newPassword = watch('newPassword')
	const mutation = useMutation(
		async ({ newPassword, confirmNewPassword }: IResetPassword) => {
			await request(
				process.env.NEXT_PUBLIC_BACKEND_URL_GRAPHQL!,
				queries.RESET_PASSWORD,
				{
					password: newPassword,
					passwordConfirmation: confirmNewPassword,
					code,
				}
			)
		},
		{
			onSuccess: () => {
				setTimeout(() => {
					router.push('/')
				}, 5000)
			},
		}
		// {
		// 	// onError: () => {
		// 	//     setError("")
		// 	// },
		// }
	)

	const onSubmitForm = async (data: IResetPassword) => {
		mutation.mutate(data)
	}
	return (
		<Layout>
			<div className="shadow-lg p-5 rounded-lg absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
				{mutation.isLoading ? (
					<LoadingDots />
				) : mutation.isSuccess ? (
					<div className="flex flex-col gap-2 justify-center items-center max-w-xs text-center">
						<Image
							src="/green-tick.svg"
							height={50}
							width={50}
							alt="A tick indicating success"
						/>
						<p>
							Password change was successful. You will soon be redirected to the
							main page
						</p>
					</div>
				) : (
					<form
						onSubmit={handleSubmit(onSubmitForm)}
						className="flex flex-col gap-2"
					>
						<InputLabelWrapper>
							<Label htmlFor="newPassword">new password</Label>
							<Input
								type="password"
								id="newPassword"
								{...register('newPassword', {
									required: true,
								})}
								autoFocus
							/>
						</InputLabelWrapper>
						<InputLabelWrapper>
							<Label htmlFor="confirmNewPassword">confirm password</Label>
							<Input
								type="password"
								id="confirmNewPassword"
								{...register('confirmNewPassword', {
									required: true,
									validate: (v) =>
										v === newPassword || 'Passwords do not match',
									onChange: () => {
										clearErrors('confirmNewPassword')
									},
								})}
							/>
							{errors.confirmNewPassword && (
								<span className="text-red-800 text-xs">
									{errors.confirmNewPassword.message}
								</span>
							)}
						</InputLabelWrapper>
						<SubmitButton>Update</SubmitButton>
					</form>
				)}
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			code: context.query.code || '',
		},
	}
}
