import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>New Year Card 2025</title>
        <meta name="description" content="การ์ดอวยพรปีใหม่ 2025" />
        <link rel="icon" href="/favicon.ico" /> {/* แก้จาก custom-favicon.ico เป็น favicon.ico */}
      </Head>
      <Component {...pageProps} />
    </>
  )
}