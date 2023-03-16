import { loadData } from "../lib/load-data";
import Timeline from "../components/timeline";
import { filters } from "../lib/filters";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
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
    <div className="bg-secondary">
      <main>
        <div className="flex h-screen w-screen items-center justify-center">
          <h1 className="mx-auto inline-block aspect-square border-solid border-primary p-8 font-display text-8xl text-primary md:border-8 md:text-9xl">
            SAN
            <br />
            DER
            <br />
            SOM
          </h1>
        </div>

        <div className="container mx-auto max-w-4xl p-16 pb-0 md:p-16 md:pb-0">
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

        <div
          className={`fixed bottom-4 left-4 z-50 flex flex-col border-t-4 border-r-4 border-solid md:bottom-8 md:left-8 ${
            showFilters ? "border-primary bg-black" : "border-transparent"
          }`}
        >
          {showFilters && (
            <ul className="px-8 py-4">
              {filters.map(({ name }, i) => (
                <li key={`custom-checkbox-${i}`} className={`my-4`}>
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${i}`}
                    name={name}
                    value={name}
                    checked={checkedState[i]}
                    onChange={() => handleOnChange(i)}
                    className="mr-2 h-4 w-8 cursor-pointer appearance-none rounded bg-grey before:pointer-events-none before:absolute before:m-1 before:h-2 before:w-3 before:rounded before:bg-black before:transition-[margin] before:ease-in-out checked:bg-primary checked:before:ml-4"
                  />
                  <label
                    className="cursor-pointer text-white"
                    htmlFor={`custom-checkbox-${i}`}
                  >
                    {name}
                  </label>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={toggleFilters}
            className="group flex h-16 w-16 items-center justify-center"
          >
            <FontAwesomeIcon
              icon={showFilters ? faTimes : faCog}
              className={`group-hover:text-primary ${
                showFilters ? "text-primary" : "text-grey"
              }`}
            />
          </button>
        </div>
      </main>
    </div>
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
