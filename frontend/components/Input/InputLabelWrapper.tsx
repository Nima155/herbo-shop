import styled from 'styled-components'
import { motion } from 'framer-motion'
export default styled.div.attrs<{ className: string }>(({ className }) => ({
	className: 'flex flex-col gap-1 ' + className,
}))`
	&:focus-within {
		label {
			color: #059669;
		}
	}
`
