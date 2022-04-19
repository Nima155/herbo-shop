import { useEffect, useRef, useState } from 'react'

export default function useInView<T extends HTMLElement>() {
	const ref = useRef<T>(null)

	const [inView, setInView] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].intersectionRatio <= 0) {
				setInView(false)
				return
			}

			setInView(true)
		})
		if (ref.current) {
			observer.observe(ref.current!)
		}

		return () => {
			observer.disconnect()
		}
	}, [])

	return [ref, inView]
}
