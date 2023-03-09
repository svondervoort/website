import { loadData } from "../lib/load-data";

import Head from "next/head";
import Timeline from "../components/timeline";

function Home({ timelineCollection }) {
  return (
    <div className={"bg-secondary"}>
      <main>
        <div className={`flex h-screen w-screen items-center justify-center`}>
          <h1
            className={`mx-auto inline-block aspect-square border-solid border-primary p-8 font-display text-8xl text-primary md:border-8 md:text-9xl`}
          >
            SAN
            <br />
            DER
            <br />
            SOM
          </h1>
        </div>

        <div className="container mx-auto max-w-4xl p-16 pb-0 md:p-16 md:pb-0">
          {timelineCollection.map((item, i, timelineCollection) => (
            <Timeline
              key="{item.sys.id}"
              item={item}
              last={i + 1 === timelineCollection.length}
            ></Timeline>
          ))}
        </div>

        <div className="relative z-50 bg-primary p-8 md:p-16">
          <div className="container mx-auto max-w-4xl text-center text-xs text-black">
            Made with ❤️ by{" "}
            <a
              className={"underline"}
              href={"https://github.com/svondervoort"}
              target={"_blank"}
              rel="noreferrer"
            >
              svondervoort
            </a>{" "}
            using 🧰{" "}
            <a
              className={"underline"}
              href={"https://tailwindcss.com"}
              target={"_blank"}
              rel="noreferrer"
            >
              TailwindCSS
            </a>
            ,{" "}
            <a
              className={"underline"}
              href={"https://nextjs.org"}
              target={"_blank"}
              rel="noreferrer"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              className={"underline"}
              href={"https://contentful.com"}
              target={"_blank"}
              rel="noreferrer"
            >
              Contentful
            </a>{" "}
            and 🌍 hosted on{" "}
            <a
              className={"underline"}
              href={"https://vercel.com"}
              target={"_blank"}
              rel="noreferrer"
            >
              Vercel
            </a>
            .
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const data = await loadData();

  // Props returned will be passed to the page component
  const timelineCollection = data.timelineCollection?.items;

  return {
    props: {
      timelineCollection,
    },
  };
}

export default Home;
