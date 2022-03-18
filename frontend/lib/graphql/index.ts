import login from './mutations/login'
import userInfo from './queries/userInfo'
import csrf from './queries/csrf'
import forgot_password from './mutations/forgot_password'
import register from './mutations/register'
import logout from './mutations/logout'
import confirm_email from './mutations/confirm_email'
import products from './queries/products'
import reset_password from './mutations/reset_password'
import create_address from './mutations/create_address'
const exports = {
	CSRF: csrf,
	LOGIN: login,
	USER_INFO: userInfo,
	FORGOT_PASSWORD: forgot_password,
	LOGOUT: logout,
	REGISTER: register,
	CONFIRM_EMAIL: confirm_email,
	PRODUCTS: products,
	RESET_PASSWORD: reset_password,
	CREATE_ADDRESS: create_address,
}

export default exports
