import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html className={'bg-black h-100 relative before:top-0 md:before:h-8 md:after:h-8 before:h-4 before:bg-primary before:fixed before:left-0 before:right-0 after:fixed after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-primary before:z-40 after:z-40'}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Major+Mono+Display&display=swap" rel="stylesheet"/>
            </Head>
            <body className={'min-h-screen relative before:left-0 before:w-4 md:before:w-8 before:bg-primary before:fixed before:top-0 before:bottom-0 after:fixed after:right-0 after:top-0 after:bottom-0 after:w-4 md:after:w-8 after:bg-primary before:z-40 after:z-40'}>
                <Main/>
                <NextScript />
            </body>
        </Html>
    )
}
