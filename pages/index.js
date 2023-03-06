import { loadData } from '../lib/load-data';

import Head from 'next/head';
import Timeline from "../components/timeline";

function Home({timelineCollection}) {
    return (
        <div className={'bg-secondary'}>
            <main>
                <div className={`h-screen w-screen flex items-center justify-center`}>
                    <h1 className={`font-display aspect-square text-9xl mx-auto text-primary border-8 border-solid border-primary p-8 inline-block`}>SAN<br/>DER<br/>SOM</h1>
                </div>

                <div className="container mx-auto max-w-4xl p-8 md:p-16">
                    {timelineCollection.map((item) => (
                        <Timeline key="{item.sys.id}" item={item}></Timeline>
                    ))}
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
            timelineCollection
        }
    }
}

export default Home;
