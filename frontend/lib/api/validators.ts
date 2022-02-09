import ApiError from './error/ApiError'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
type SignUpData = {
	username: unknown
	password: unknown
	email: unknown
}

function isString(item: unknown): item is string {
	return Object.prototype.toString.call(item) === '[object String]'
}
function parseEmail(item: unknown): string {
	if (!item || !isString(item) || !isEmail(item)) {
		throw ApiError.badRequest('Invalid/missing email address')
	}
	return item
}
function parseUsername(name: unknown) {
	if (!isString(name) || !name) {
		throw ApiError.badRequest('Invalid/missing username')
	}
	return name
}

function parsePassword(password: unknown) {
	if (!password || !isString(password)) {
		throw ApiError.badRequest('Missing/invalid password')
	}
	if (
		!isStrongPassword(password, {
			minLength: 8,
			minLowercase: 1,
			minNumbers: 1,
			minUppercase: 1,
			minSymbols: 1,
		})
	) {
		throw new ApiError(
			400,
			'Password must be at least 8 characters long and contain: 1 lowercase letter, 1 uppercase letter, 1 digit and 1 symbol'
		)
	}
	return password
}

export default function toPasswordEmailUsername({
	username,
	password,
	email,
}: SignUpData): SignUpData {
	return {
		username: parseUsername(username),
		email: parseEmail(email),
		password: parsePassword(password),
	}
}
