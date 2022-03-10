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
	shipping = 'shipping',
	billing = 'billing',
}

export type Address = {
	country: string
	addressOne: string
	county: string
	city: string
	zipCode: string
	addressType: AddressType
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
