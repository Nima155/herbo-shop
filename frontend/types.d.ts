import { IronSessionData } from 'iron-session'
declare module 'iron-session' {
	interface IronSessionData {
		token?: string
	}
}
declare module 'flubber'
