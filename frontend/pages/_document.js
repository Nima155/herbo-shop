import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html>
				<Head />

				<body className="bg-slate-100">
					<Main />

					<NextScript />

					<div className="z-30" id="toastContainer" />
					{/* <div className="z-30" id="hamburger" /> */}
				</body>
			</Html>
		)
	}
}

export default MyDocument
