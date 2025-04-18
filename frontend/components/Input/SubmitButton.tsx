import styled from 'styled-components'
import Button from '../Button'

export default styled(Button).attrs((props) => ({
	className:
		'bg-emerald-500 text-gray-100 hover:bg-emerald-700 transition-colors py-1 px-7 duration-150 ease-in self-start' +
		props.className,
}))``
