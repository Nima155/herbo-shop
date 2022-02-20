import login from './mutations/login'
import userInfo from './queries/userInfo'
import csrf from './queries/csrf'
import forgot_password from './mutations/forgot_password'
import register from './mutations/register'
import logout from './mutations/logout'
const exports = {
	CSRF: csrf,
	LOGIN: login,
	USER_INFO: userInfo,
	FORGOT_PASSWORD: forgot_password,
	LOGOUT: logout,
	REGISTER: register,
}

export default exports
