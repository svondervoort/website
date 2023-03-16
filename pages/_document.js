import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-100 relative bg-black before:fixed before:top-0 before:left-0 before:right-0 before:z-40 before:h-4 before:bg-primary after:fixed after:bottom-0 after:left-0 after:right-0 after:z-40 after:h-4 after:bg-primary md:before:h-8 md:after:h-8">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Major+Mono+Display&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="relative min-h-screen before:fixed before:left-0 before:top-0 before:bottom-0 before:z-40 before:w-4 before:bg-primary after:fixed after:right-0 after:top-0 after:bottom-0 after:z-40 after:w-4 after:bg-primary md:before:w-8 md:after:w-8">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
