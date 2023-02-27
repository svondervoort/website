import {GRAPH_TOKEN, GRAPH_URL} from '../lib/constants';
import { loadData } from '../lib/load-data';

import Head from 'next/head';
import SkillCategory from "../components/skill-category";
import Experience from "../components/experience";
import Education from "../components/education";

function Home({educationCollection, experienceCollection, skillsCollection}) {
    return (
        <div className={'bg-secondary'}>
            <Head>
                <title>NextJS Portfolio</title>
                <meta name='description' content='Generated by create next app'/>
                <link rel='icon' href='/favicon.ico'/>
            </Head>
            <main>
                <div className="container mx-auto prose lg:prose-xl px-8 py-8 md:px-0 md:py-16">
                    <div className={'border border-solid border-primary p-8 my-8 md:p-16 md:my-16'}>
                        <h2 className={'text-primary'}>Skills</h2>
                        {skillsCollection.map((item) => (
                            <SkillCategory key="{item.sys.id}" item={item}></SkillCategory>
                        ))}
                    </div>
                    <div className={'border border-solid border-primary p-8 my-8 md:p-16 md:my-16'}>
                        <h2 className={'text-primary'}>Work experience</h2>
                        <div className={''}>
                            {experienceCollection.map((item) => (
                                <Experience key="{item.sys.id}" item={item}></Experience>
                            ))}
                        </div>
                    </div>
                    <div className={'border border-solid border-primary p-8 my-8 md:p-16 md:my-16'}>
                        <h2 className={'text-primary'}>Education</h2>
                        <div className={''}>
                            {educationCollection.map((item) => (
                                <Education key="{item.sys.id}" item={item}></Education>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export async function getStaticProps(context) {
    // Instead of fetching your `/api` route you can call the same
    // function directly in `getStaticProps`
    const data = await loadData();

    // Props returned will be passed to the page component
    const educationCollection = data.educationCollection?.items;
    const experienceCollection = data.experienceCollection?.items;
    const skillsCollection = data.skillCategoryCollection?.items;

    return {
        props: {
            educationCollection,
            experienceCollection,
            skillsCollection
        }
    }
}

export default Home;
