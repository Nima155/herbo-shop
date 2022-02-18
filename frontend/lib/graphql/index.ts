import login from './mutations/login'
import userInfo from './queries/userInfo'
import csrf from './queries/csrf'
import logout from './mutations/logout'
const exports = {
	CSRF: csrf,
	LOGIN: login,
	USER_INFO: userInfo,

	LOGOUT: logout,
}

export default exports
