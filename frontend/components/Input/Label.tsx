import styled from 'styled-components'

export default styled.label.attrs<{ className: string }>((props) => ({
	className: `2xl:text-lg capitalize self-start text-slate-500 tracking-wide ${props.className}`,
}))``
