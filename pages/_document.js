import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html className={'bg-secondary h-100'}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;700&display=swap"
                    rel="stylesheet"/>
            </Head>
            <body className={'min-h-screen flex flex-col'}>
                <Main/>
                <NextScript />
            </body>
        </Html>
    )
}
