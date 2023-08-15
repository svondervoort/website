import { loadData } from "../lib/load-data";
import Timeline from "../components/timeline";
import { filters } from "../lib/filters";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function Home({ timelineCollection }) {
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
                        className={`appearance-none absolute top-2/4 lg:top-auto lg:bottom-0 left-6 lg:left-2/4 -translate-y-2/4 lg:-translate-y-0 lg:-translate-x-2/4 w-[14px] h-1 bg-white ${
                          checkedState[i] ? "shadow-switch shadow-white" : ""
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
      <div className="relative container mx-auto md:max-w-3xl py-8 lg:py-16 pl-16 lg:pl-24 before:absolute before:bottom-0 before:top-0 before:left-4 before:w-0.5 before:bg-white/50">
        <div className="aspect-square border-solid border-white border-opacity-50 lg:p-8 lg:border-4 lg:text-9xl">
          <h1 className="font-display leading-none text-[20vw] lg:text-[33cqw]">
            SAN
            <br />
            DER
            <br />
            SOM
          </h1>
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
    },
  };
}

export default Home;
