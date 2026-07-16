import {
  faBriefcase,
  faWrench,
  faUser,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

export const filters = [
  {
    name: "Werkervaring",
    type: "Experience",
    icon: faBriefcase,
  },
  {
    name: "Gereedschap",
    type: "Skill",
    icon: faWrench,
  },
  {
    name: "Klanten",
    type: "Client",
    icon: faUser,
  },
  {
    name: "Opleidingen",
    type: "Education",
    icon: faGraduationCap,
  },
];

// The timeline marker and the filter share one icon per type, so the filter bar
// doubles as the legend for the markers on the rail.
export const iconForType = (type) =>
  filters.find((filter) => filter.type === type)?.icon;
