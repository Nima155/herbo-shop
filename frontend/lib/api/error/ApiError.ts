export default class ApiError {
	readonly status: number
	readonly message: string
	constructor(status: number, message: string) {
		this.status = status
		this.message = message
	}
	static notFound(msg: string) {
		return new ApiError(404, msg)
	}
	static badRequest(msg: string) {
		return new ApiError(400, msg)
	}
	static unauthorized(msg: string) {
		return new ApiError(401, msg)
	}
}
