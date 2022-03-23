import {
	useFieldArray,
	UseFieldArrayReturn,
	useForm,
	UseFormReturn,
} from 'react-hook-form'
import create from 'zustand/react'
import { IAddress } from './types'

type AddressStorage = {
	useFormObj: UseFormReturn<{ addressForms: IAddress[] }>
	useFieldArrayObj: UseFieldArrayReturn<{ addressForms: IAddress[] }>
}

const useAddressForm = create<AddressStorage>((set, get) => ({
	useFormObj: useForm({ reValidateMode: 'onSubmit' }),
	useFieldArrayObj: useFieldArray({
		name: 'addressForms',
		control: get().useFormObj.control,
	}),
}))

export default useAddressForm
