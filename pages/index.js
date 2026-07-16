import { loadData } from "../lib/load-data";
import Timeline from "../components/timeline";
import { filters } from "../lib/filters";
import Game from "../components/game";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faGithub,
  faCodepen,
  faSteam,
} from "@fortawesome/free-brands-svg-icons";

const socialLinks = [
  {
    name: "Mail",
    href: "mailto:hallo@svondervoort.net",
    icon: faEnvelope,
  },
  {
    name: "LinkedIn",
    href: "https://nl.linkedin.com/in/svondervoort",
    icon: faLinkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/svondervoort",
    icon: faGithub,
  },
  {
    name: "CodePen",
    href: "https://codepen.io/svondervoort/",
    icon: faCodepen,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/id/sander2/",
    icon: faSteam,
  },
];

function Home({ timelineCollection, yearsOfExperience, yearsOld }) {
  const [checkedState, setCheckedState] = React.useState(
    new Array(filters.length).fill(true)
  );
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState(
    filters.map(({ type }) => type)
  );

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const newActiveFilters = [];

    updatedCheckedState.forEach((el, i) => {
      if (el === true) {
        newActiveFilters.push(filters[i].type);
      }
    });

    setActiveFilters(newActiveFilters);
  };

  return (
    <main className="px-8 pt-24 lg:px-0 lg:pt-32">
      <div className="fixed left-8 top-8 right-8 lg:left-16 lg:top-16 lg:right-16 z-50">
        <div className="relative container mx-auto backdrop-blur-2xl bg-white/50 rounded-lg pt-16 lg:pt-0 lg:px-16 min-h-[64px] lg:flex lg:justify-center">
          {/* Logo */}
          <div className="absolute left-4 top-4 w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.264471 31.8534L0.264468 8.65938e-06L32 1.14441e-05L0.264471 31.8534Z" fill="white"/>
              <path opacity="0.75" d="M3.78442e-07 1.71661e-05L31.7355 1.18239e-05L31.7355 31.8534L3.78442e-07 1.71661e-05Z" fill="white"/>
              <path d="M8.8457 31.9722L16.2507 24.5398L23.6833 32L8.8457 31.9722Z" fill="#2F4541"/>
            </svg>
          </div>
          {/* Filters */}
          <nav className="border-t border-green-500/20 lg:border-0">
            <ul className={`flex-col lg:flex-row divide-y lg:divide-x divide-green-500/20 border-x border-green-500/20 lg:flex ${
                showFilters ? "flex" : "hidden"
            }`}>
              {filters.map(({ name }, i) => (
                  <li key={`custom-checkbox-${i}`} className={`relative ${
                            checkedState[i] ? "" : "opacity-20"
                        }`}>
                    <input
                        type="checkbox"
                        id={`custom-checkbox-${i}`}
                        name={name}
                        value={name}
                        checked={checkedState[i]}
                        onChange={() => handleOnChange(i)}
                        className={`appearance-none absolute top-2/4 lg:top-auto lg:bottom-0 left-6 lg:left-2/4 -translate-y-2/4 lg:-translate-y-0 lg:-translate-x-2/4 w-[14px] h-1 ${
                          checkedState[i]
                            ? "bg-accent shadow-switch shadow-accent"
                            : "bg-white"
                        }`}
                    />
                    <label className="block cursor-pointer leading-4 pl-16 lg:pl-8 pr-8 py-6 hover:bg-white/10" htmlFor={`custom-checkbox-${i}`}
                    >
                      {name}
                    </label>
                  </li>
              ))}
            </ul>
          </nav>

          <button
              onClick={toggleFilters}
              className="lg:hidden absolute right-4 top-4 w-8 h-8 flex items-center justify-center"
          >
            <FontAwesomeIcon
                icon={showFilters ? faTimes : faFilter}
                className="group-hover:text-primary text-white"
            />
          </button>
        </div>
      </div>
      <div className="relative container mx-auto md:max-w-3xl py-8 lg:py-16 pl-16 lg:pl-24">
        <h1 className="sr-only">Sander van de Vondervoort</h1>

        {/* The timeline line stops at the game and picks up again below it, so it
            never crosses the card. */}
        <div className="absolute left-4 top-0 h-8 w-0.5 bg-white/50 lg:h-16" />
        <div className="timeline-line--below-hero absolute bottom-0 left-4 w-0.5 bg-white/50" />

        <Game />

        <div className="mt-12 font-mono text-sm text-white md:text-base lg:mt-16">
          <p>
            Hoi, ik ben Sander van de Vondervoort. {yearsOld} jaar oud. Ik ben Frontend
            Developer 💻, getrouwd 💍, vader van 2 👧👦 en gamer 👾.
          </p>

          <p className="mt-4">
            Al {yearsOfExperience} jaar zet ik designs om naar werkende, onderhoudbare frontends. Van componenten architectuur en Twig tot (S)CSS en Javascript, de laatste jaren vooral met Craft CMS.
          </p>

          <p className="mt-4">
            Ik hou van structuur en consistentie. Ik werk goed zelfstandig, maar voel me ook thuis in een team. Ik ben sociaal en makkelijk in de omgang. Mede daardoor heb ik ook veel direct contact met klanten om de lijntjes zo kort mogelijk te houden.
          </p>

          <p className="mt-4">
            Benieuwd wat ik voor jou kan betekenen? Bekijk mijn CV hieronder of neem contact met me op via:
          </p>

          <ul className="mt-6 flex gap-6">
            {socialLinks.map(({ name, href, icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <FontAwesomeIcon icon={icon} className="text-xl" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl">
        {timelineCollection.map(
          (item, i, timelineCollection) =>
            activeFilters.includes(item.type) && (
              <Timeline
                key={item.sys.id}
                item={item}
                last={i + 1 === timelineCollection.length}
              ></Timeline>
            )
        )}
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const data = await loadData();
  const timelineCollection = data.timelineCollection?.items;

  return {
    props: {
      timelineCollection,
      yearsOfExperience: yearsSinceFirstExperience(timelineCollection),
      yearsOld: yearsSince(new Date(1988, 7, 20)),
    },
  };
}

function yearsSince(start) {
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();

  if (
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())
  ) {
    years--;
  }

  return years;
}

function yearsSinceFirstExperience(timelineCollection) {
  const startDates = timelineCollection
    .filter(({ type, from }) => type === `Experience` && from != null)
    .map(({ from }) => new Date(from));

  return yearsSince(new Date(Math.min(...startDates)));
}

export default Home;
