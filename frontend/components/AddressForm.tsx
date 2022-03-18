import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { AVAILABLE_COUNTRIES } from '../lib/constants'
import { authenticatedGraphQl } from '../lib/helpers'
import { Address, AddressType } from '../lib/types'
import Input from './Input'
import InputLabelWrapper from './Input/InputLabelWrapper'
import Label from './Input/Label'
import SubmitButton from './Input/SubmitButton'
import LoadingDots from './LoadingDots'
import queries from '../lib/graphql'

const { CREATE_ADDRESS, CSRF } = queries
type FormAddress = Omit<Address, 'addressType'> & { isAlsoBilling: boolean }

export default function AddressForm(props: {
	buttonText: string
	address?: Address
}) {
	const { buttonText, address } = props

	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
		setError,
		clearErrors,
		reset,
	} = useForm<FormAddress>({
		reValidateMode: 'onSubmit',
		defaultValues: { ...address },
	})
	const gqlClient = authenticatedGraphQl()

	const mutation = useMutation(
		async (data: FormAddress) => {
			const { _csrf } = await gqlClient.request(CSRF)

			const {
				isAlsoBilling,
				addressOne,
				zipCode,
				firstName,
				lastName,
				phoneNumber,
				...rest
			} = data

			return await gqlClient.request(
				CREATE_ADDRESS,
				{
					address: {
						...rest,
						address_1: addressOne,
						is_billing: isAlsoBilling,
						zip_code: zipCode,
						first_name: firstName,
						last_name: lastName,
						phone_number: phoneNumber,
					},
				},
				{
					'x-xsrf-token': _csrf,
				}
			)
		},
		{
			onError: (err) => {
				setError('isAlsoBilling', { message: err.response.errors[0].message })
			},
			onSuccess: (data) => {
				// TODO.. check if shipping then...
				if (
					data.createAddress.data.attributes.address_type ===
					AddressType.Billing
				) {
				}

				reset()
			},
		}
	)

	const onAddressCreate = (data: FormAddress) => {
		mutation.mutate(data)
	}

	const chosenCountry = watch('country')
	// console.log(chosenCountry)
	return (
		<div className="relative w-full">
			<form
				className={`flex flex-col gap-2 w-full mb-2`}
				onSubmit={handleSubmit(onAddressCreate)}
			>
				<InputLabelWrapper>
					<Label htmlFor="first_name">First Name</Label>
					<Input
						type="text"
						id="first_name"
						{...register('firstName', {
							required: { message: 'Missing name field', value: true },
							onChange: () => {
								clearErrors('firstName')
							},
						})}
					/>
					{errors.firstName && (
						<span className="text-red-800 text-xs">
							{errors.firstName.message}
						</span>
					)}
				</InputLabelWrapper>
				<InputLabelWrapper>
					<Label htmlFor="last_name">Last Name</Label>
					<Input
						type="text"
						id="last_name"
						{...register('lastName', {
							required: { message: 'Missing last name field', value: true },
							onChange: () => {
								clearErrors('lastName')
							},
						})}
					/>
					{errors.lastName && (
						<span className="text-red-800 text-xs">
							{errors.lastName.message}
						</span>
					)}
				</InputLabelWrapper>
				<InputLabelWrapper>
					<Label htmlFor="address">Address</Label>
					<Input
						type="text"
						id="address"
						{...register('addressOne', {
							required: { message: 'Missing address field', value: true },
							onChange: () => {
								clearErrors('addressOne')
							},
						})}
					/>
					{errors.addressOne && (
						<span className="text-red-800 text-xs">
							{errors.addressOne.message}
						</span>
					)}
				</InputLabelWrapper>

				<InputLabelWrapper>
					<Label htmlFor="country" className="sr-only">
						Country
					</Label>
					<select
						id="country"
						className="p-2 rounded-sm text-slate-700"
						{...register('country', {
							required: { message: 'missing country field', value: true },
							onChange: () => {
								clearErrors('country')
							},
						})}
						defaultValue=""
					>
						<option value="">Select Country</option>
						{AVAILABLE_COUNTRIES.map(
							({ value: name, code: countryCode, map: mapEmoji }) => (
								<option value={name} key={countryCode}>
									{`${mapEmoji} ${name}`}
								</option>
							)
						)}
					</select>
					{errors.country && (
						<span className="text-red-800 text-xs">
							{errors.country.message}
						</span>
					)}
				</InputLabelWrapper>
				<InputLabelWrapper>
					<Label htmlFor="state">State / Region</Label>
					<Input
						type="text"
						id="state"
						{...register('state', {
							required: {
								message: 'Missing state/region field',
								value: true,
							},
							onChange: () => {
								clearErrors('state')
							},
						})}
					/>
					{errors.state && (
						<span className="text-red-800 text-xs">{errors.state.message}</span>
					)}
				</InputLabelWrapper>
				<InputLabelWrapper>
					<Label htmlFor="city">City</Label>
					<Input
						type="text"
						id="city"
						{...register('city', {
							required: { message: 'Missing city field', value: true },
							onChange: () => {
								clearErrors('city')
							},
						})}
					/>
					{errors.city && (
						<span className="text-red-800 text-xs">{errors.city.message}</span>
					)}
				</InputLabelWrapper>

				<InputLabelWrapper>
					<Label htmlFor="zip_code">Postal / Zip Code</Label>
					<Input
						type="text"
						id="zip_code"
						{...register('zipCode', {
							required: { message: 'Missing zip code field', value: true },
							onChange: () => {
								clearErrors('zipCode')
							},
						})}
					/>
					{errors.zipCode && (
						<span className="text-red-800 text-xs">
							{errors.zipCode.message}
						</span>
					)}
				</InputLabelWrapper>
				<InputLabelWrapper>
					<Label htmlFor="phone_number">Phone Number</Label>
					<div className="flex gap-2">
						<span className="bg-slate-300/60 p-1 text-slate-700 flex items-center rounded-sm">
							+
							{AVAILABLE_COUNTRIES.filter((e) => e.value === chosenCountry)[0]
								?.phoneCode || '00'}
						</span>
						<Input
							type="text"
							id="phone_number"
							{...register('phoneNumber', {
								required: {
									message: 'Missing phone number field',
									value: true,
								},
								setValueAs: (v) =>
									`${
										AVAILABLE_COUNTRIES.filter(
											(e) => e.value === chosenCountry
										)[0]?.phoneCode
									}${v}`,
								onChange: () => {
									clearErrors('phoneNumber')
								},
							})}
							className="flex-grow"
						/>
					</div>
					{errors.phoneNumber && (
						<span className="text-red-800 text-xs">
							{errors?.phoneNumber.message}
						</span>
					)}
				</InputLabelWrapper>
				<InputLabelWrapper>
					<div>
						<input
							type="checkbox"
							id="billingBox"
							{...register('isAlsoBilling')}
							className="sr-only peer"
						/>
						<Label
							className="flex items-center normal-case cursor-pointer rounded-md
							before:content-[''] before:h-5 before:w-5 before:border-2 
							before:mr-2 before:border-slate-300 
							before:rounded-md before:peer-checked:content-['\2713'] 
							before:flex before:items-center before:justify-center 
							peer-focus-visible:ring-[#059669]/40 
							peer-focus-visible:ring-1 peer-focus-visible:ring-offset-2"
							htmlFor="billingBox"
						>
							Set as default billing address
						</Label>
					</div>
					{errors.isAlsoBilling && (
						<span className="text-red-800 text-xs">
							{errors?.isAlsoBilling.message}
						</span>
					)}
				</InputLabelWrapper>

				{mutation.isLoading && <LoadingDots />}
				<SubmitButton className="mb-2 mt-2">{buttonText}</SubmitButton>
			</form>
		</div>
	)
}
