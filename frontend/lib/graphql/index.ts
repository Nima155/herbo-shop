import login from './mutations/login'
import userInfo from './queries/userInfo'
import userInfoNoCSRF from './queries/userInfoNoCSRF'
const exports = {
	LOGIN: login,
	USER_INFO: userInfo,
	USER_INFO_NO_CSRF: userInfoNoCSRF,
}

export default exports
