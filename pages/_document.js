import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-100 relative bg-gradient-to-br from-green-500 to-green-300">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Major+Mono+Display&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="relative min-h-screen text-white font-mono">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
