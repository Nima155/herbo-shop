import styled from 'styled-components'

export default styled.input.attrs<{ className: string }>((props) => ({
	className: `md:text-lg 2xl:text-2xl rounded-sm border-slate-300 ${props.className}`,
}))`
	border-width: 1px;
	padding: 4px;

	&:focus {
		outline: solid;
		outline-width: thin;
		outline-color: #059669;
	}
	&:focus + label {
		color: green;
	}
`
