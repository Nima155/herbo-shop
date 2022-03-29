import { useFieldArray, useFormContext } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { AVAILABLE_COUNTRIES } from '../lib/constants'
import { authenticatedGraphQl } from '../lib/helpers'
import { IAddress } from '../lib/types'
import Input from './Input'
import InputLabelWrapper from './Input/InputLabelWrapper'
import Label from './Input/Label'
import SubmitButton from './Input/SubmitButton'
import LoadingDots from './LoadingDots'
import queries from '../lib/graphql'
import produce from 'immer'

const { CSRF } = queries

export default function AddressForm(props: {
	buttonText: string
	address?: IAddress & { id?: string }
	query: { queryURL: string; queryArgs?: any }
	closeModal?: () => void
	index: number
}) {
	const {
		query,
		buttonText,
		address: { id: addressId = '', ...rest } = {},
		index,
	} = props

	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
		clearErrors,
		reset,
		control,
	} = useFormContext<{ addressForms: IAddress[] }>()

	const { fields, append } = useFieldArray({
		name: 'addressForms',
		control,
	})

	const queryClient = useQueryClient()

	const gqlClient = authenticatedGraphQl()

	const mutation = useMutation(
		async (data: IAddress) => {
			const { _csrf } = await gqlClient.request(CSRF)

			const {
				addressOne,
				zipCode,
				firstName,
				lastName,
				phoneNumber,
				isShipping,
				...rest
			} = data

			return await gqlClient.request(
				query.queryURL,
				{
					address: {
						...rest,
						is_shipping: isShipping,
						address_1: addressOne,
						// is_billing: isBilling,
						zip_code: zipCode,
						first_name: firstName,
						last_name: lastName,
						phone_number: phoneNumber,
					},
					...query.queryArgs,
				},
				{
					'x-xsrf-token': _csrf,
				}
			)
		},
		{
			onError: (err) => {
				// setError('phoneNumber', { message: err.response.errors[0].message })
			},
			onSuccess: (res) => {
				if (!props.address) {
					queryClient.setQueryData('user_addresses', (old) => {
						return produce(old, (newState) => {
							newState.me.addresses.push(res.createAddress.data)
						})
					})
					reset()
				} else {
					queryClient.setQueryData('user_addresses', (old) => {
						return produce(old, (newState) => {
							const new_new = newState.me.addresses.filter(
								(e) => e.id !== res.updateAddress.data.id
							)
							newState.me.addresses = [...new_new, res.updateAddress.data]
						})
					})
					props?.closeModal!()
				}
			},
		}
	)

	const onAddressCreate = (data: { addressForms: IAddress[] }) => {
		mutation.mutate(data.addressForms[index])
	}

	// console.log(chosenCountry, index)
	const chosenCountry = watch(`addressForms.${index}.country`)

	return (
		<div className="relative w-full">
			<form onSubmit={handleSubmit(onAddressCreate)}>
				<div
					className={`flex flex-col gap-2 w-full mb-2`}
					key={fields[index]?.id}
				>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.firstName`}>
							First Name
						</Label>
						<Input
							type="text"
							id={`addressForms.${index}.firstName`}
							{...register(`addressForms.${index}.firstName` as const, {
								required: { message: 'Missing name field', value: !index },
								onChange: () => {
									clearErrors(`addressForms.${index}.firstName`)
								},
							})}
							defaultValue=""
						/>
						{errors?.addressForms?.[index]?.firstName && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.firstName?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.lastName`}>Last Name</Label>
						<Input
							type="text"
							id={`addressForms.${index}.lastName`}
							{...register(`addressForms.${index}.lastName` as const, {
								required: {
									message: 'Missing last name field',
									value: !index,
								},
								onChange: () => {
									clearErrors(`addressForms.${index}.lastName`)
								},
							})}
							defaultValue=""
						/>
						{errors?.addressForms?.[index]?.lastName && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.lastName?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.addressOne`}>Address</Label>
						<Input
							type="text"
							id={`addressForms.${index}.addressOne`}
							{...register(`addressForms.${index}.addressOne` as const, {
								required: { message: 'Missing address field', value: !index },
								onChange: () => {
									clearErrors(`addressForms.${index}.addressOne`)
								},
							})}
							defaultValue=""
						/>
						{errors?.addressForms?.[index]?.addressOne && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.addressOne?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label
							htmlFor={`addressForms.${index}.country`}
							className="sr-only"
						>
							Country
						</Label>
						<select
							id={`addressForms.${index}.country`}
							className="p-2 rounded-sm text-slate-700"
							{...register(`addressForms.${index}.country` as const, {
								required: { message: 'Missing country field', value: !index },
								onChange: () => {
									clearErrors(`addressForms.${index}.country`)
								},
							})}
							defaultValue=""
						>
							<option value="">Select Country</option>
							{AVAILABLE_COUNTRIES.map(
								({ value: name, code: countryCode, map: mapEmoji }) => (
									<option value={countryCode} key={countryCode}>
										{`${mapEmoji} ${name}`}
									</option>
								)
							)}
						</select>
						{errors?.addressForms?.[index]?.country && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.country?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.state`}>
							State / Region
						</Label>
						<Input
							type="text"
							id={`addressForms.${index}.state`}
							{...register(`addressForms.${index}.state` as const, {
								required: {
									message: 'Missing state / region field',
									value: !index,
								},
								onChange: () => {
									clearErrors(`addressForms.${index}.state`)
								},
							})}
							defaultValue=""
						/>
						{errors?.addressForms?.[index]?.state && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.state?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.city`}>City</Label>
						<Input
							type="text"
							id={`addressForms.${index}.city`}
							{...register(`addressForms.${index}.city` as const, {
								required: { message: 'Missing city field', value: !index },
								onChange: () => {
									clearErrors(`addressForms.${index}.city`)
								},
							})}
							defaultValue=""
						/>
						{errors?.addressForms?.[index]?.city && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.city?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.zipCode`}>
							Postal / Zip Code
						</Label>
						<Input
							type="text"
							id={`addressForms.${index}.zipCode`}
							{...register(`addressForms.${index}.zipCode` as const, {
								required: {
									message: 'Missing zip code field',
									value: !index,
								},
								onChange: () => {
									clearErrors(`addressForms.${index}.zipCode`)
								},
							})}
							defaultValue=""
						/>
						{errors?.addressForms?.[index]?.zipCode && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.zipCode?.message}
							</span>
						)}
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label htmlFor={`addressForms.${index}.phoneNumber`}>
							Phone Number
						</Label>
						<div className="flex gap-2">
							<span className="bg-slate-300/60 p-1 text-slate-700 flex items-center rounded-sm">
								+
								{AVAILABLE_COUNTRIES.filter((e) => e.code === chosenCountry)[0]
									?.phoneCode || '00'}
							</span>
							<Input
								type="text"
								id={`addressForms.${index}.phoneNumber`}
								{...register(`addressForms.${index}.phoneNumber` as const, {
									required: {
										message: 'Missing phone number field',
										value: !index,
									},
									// TODO: fix duplication bug with edits..
									setValueAs: (v) =>
										v &&
										`${
											AVAILABLE_COUNTRIES.filter(
												(e) => e.code === chosenCountry
											)[0]?.phoneCode
										}${v}`,
									onChange: () => {
										clearErrors(`addressForms.${index}.phoneNumber`)
									},
								})}
								defaultValue=""
								className="flex-grow"
							/>
						</div>
						{errors?.addressForms?.[index]?.phoneNumber && (
							<span className="text-red-800 text-xs">
								{errors?.addressForms?.[index]?.phoneNumber?.message}
							</span>
						)}
					</InputLabelWrapper>

					{mutation.isLoading && <LoadingDots />}
					<SubmitButton className="mb-2 mt-2 rounded-sm">
						{buttonText}
					</SubmitButton>
				</div>
			</form>
		</div>
	)
}

/* <InputLabelWrapper>
	<div>
		<input
			type="checkbox"
			id={`billingBox ${addressId}`}
			className="peer sr-only"
			{...register('isBilling')}
		/>
		<Label
			className="flex items-center normal-case cursor-pointer rounded-md
			before:content-[''] before:h-5 before:w-5 before:border-2
			before:mr-2 before:border-slate-300
			before:rounded-md before:peer-checked:content-['\2713']
			before:flex before:items-center before:justify-center
			peer-focus-visible:ring-[#059669]/40
			peer-focus-visible:ring-1 peer-focus-visible:ring-offset-2"
			htmlFor={`billingBox ${addressId}`}
		>
			Set as default billing address
		</Label>
	</div>
	{errors.isBilling && (
		<span className="text-red-800 text-xs">
			{errors?.isBilling.message}
		</span>
	)}
</InputLabelWrapper> */
