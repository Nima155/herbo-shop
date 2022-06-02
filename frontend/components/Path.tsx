import { motion } from 'framer-motion'

const Path = (props: any) => (
	<motion.path
		fill="transparent"
		strokeWidth="3"
		stroke="hsl(0, 0%, 18%)"
		strokeLinecap="round"
		{...props}
	/>
)
export default Path
