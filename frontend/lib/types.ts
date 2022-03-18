interface PictureData {
	ext: string
	url: string
	hash: string
	mime: string
	name: string
	path?: string
	size: number
	width: number
	height: number
}

interface StrapiPicture {
	url: string
	formats: {
		small: PictureData
		medium: PictureData
		thumbnail: PictureData
	}
}

export enum AddressType {
	Shipping = 'Shipping',
	Billing = 'Billing',
}

export type Address = {
	firstName: string
	lastName: string
	country: string
	addressOne: string
	city: string
	zipCode: string
	phoneNumber: string
	addressType: AddressType
	state: string
}

export interface ProductAttributes {
	price: number
	name: string
	description: string

	picture: {
		data: [
			{
				attributes: StrapiPicture
			}
		]
	}
	id: string
}
