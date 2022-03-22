import LOGIN from './mutations/login'
import USER_INFO from './queries/userInfo'
import CSRF from './queries/csrf'
import FORGOT_PASSWORD from './mutations/forgotPassword'
import REGISTER from './mutations/register'
import LOGOUT from './mutations/logout'
import CONFIRM_EMAIL from './mutations/confirmEmail'
import PRODUCTS from './queries/products'
import RESET_PASSWORD from './mutations/resetPassword'
import CREATE_ADDRESS from './mutations/createAddress'
import GET_ADDRESSES from './queries/userAddresses'
import UPDATE_ADDRESS from './mutations/updateAddress'
const exports = {
	CSRF,
	LOGIN,
	USER_INFO,
	FORGOT_PASSWORD,
	LOGOUT,
	REGISTER,
	CONFIRM_EMAIL,
	PRODUCTS,
	RESET_PASSWORD,
	CREATE_ADDRESS,
	GET_ADDRESSES,
	UPDATE_ADDRESS,
}

export default exports
