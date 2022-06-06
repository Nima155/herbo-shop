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

export interface IAddress {
	firstName: string
	lastName: string
	country: string
	addressOne: string
	city: string
	zipCode: string
	phoneNumber: string
	state: string
	isShipping?: boolean
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

export interface IModalToggle {
	children?: (animation: any) => React.ReactNode

	id: number
}

export type SortByItem = {
	/**
	 * The name of the index to target.
	 */
	value: string
	/**
	 * The label of the index to display.
	 */
	label: string
}
