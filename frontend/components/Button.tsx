import styled from 'styled-components'

export default styled.button.attrs((props) => ({
	className: 'rounded-sm flex justify-center items-center' + props.className,
}))``
