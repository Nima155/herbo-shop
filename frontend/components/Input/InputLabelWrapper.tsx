import styled from 'styled-components'

export default styled.div.attrs(() => ({
	className: 'flex flex-col gap-1',
}))`
	&:focus-within {
		label {
			color: #059669;
		}
	}
`
