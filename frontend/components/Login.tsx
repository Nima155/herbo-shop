import React, { useState } from 'react'
import UnderlineButton from './UnderlineButton'
import Modal from './Modal'
import Input from './Input'
import Label from './Input/Label'
import InputLabelWrapper from './Input/InputLabelWrapper'
import Button from './Button'
import { useForm, SubmitHandler } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import useUser from '../lib/useUser'

type LoginFormData = {
	ident: string
	password: string
}
export default function Login() {
	const [modalStatus, setModalStatus] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>()
	const { user, loginUser } = useUser()
	// console.log(user)

	const onSubmit: SubmitHandler<LoginFormData> = ({ ident, password }) => {
		loginUser.mutate({
			identifier: ident,
			password,
		})
	}

	return (
		<div>
			<UnderlineButton onClick={() => setModalStatus(true)}>
				Login
			</UnderlineButton>
			<Modal
				modalIsOpen={modalStatus}
				modalSetter={() => setModalStatus(false)}
				twStyles="p-10 bg-white rounded-md"
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
				<form className="flex gap-2 flex-col" onSubmit={handleSubmit(onSubmit)}>
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
								validate: {
									validitiy: (v) => isEmail(v) || 'Invalid email format',
								},
							})}
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
							})}
						/>
					</InputLabelWrapper>

					<Button
						type="submit"
						className="bg-emerald-500 text-gray-100 hover:bg-emerald-700 focus:bg-emerald-700 transition-colors p-1 duration-150 ease-in mt-3"
					>
						Login
					</Button>
				</form>
			</Modal>
		</div>
	)
}
