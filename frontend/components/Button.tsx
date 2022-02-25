import styled from 'styled-components'
import { motion } from 'framer-motion'
export default styled(motion.button).attrs((props) => ({
	className: 'rounded-sm flex justify-center items-center ' + props.className,
}))``
