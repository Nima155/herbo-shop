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

export interface ProductAttributes {
	price: number
	name: string
	description: string
	sku: string
	picture: {
		data: [
			{
				attributes: StrapiPicture
			}
		]
	}
	id: string
}
