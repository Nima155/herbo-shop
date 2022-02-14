import styled from 'styled-components'
// import tw from 'twin.macro'
export default styled.button`
	margin-right: 0.5rem;
	margin-left: 0.5rem;
	position: relative;
	&:after {
		content: '';
		width: 100%;
		transform: scale3d(0, 1, 0);
		position: absolute;
		bottom: 0px;
		left: 0px;
		background-color: green;
		height: 1px;
		transform-origin: top left;
		transition: transform 250ms;
	}
	&:hover,
	&:focus {
		&:after {
			transform: scale3d(1, 1, 1);
		}
	}
`
