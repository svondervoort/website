import {
  faBriefcase,
  faWrench,
  faUser,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

// Order here drives both the filter nav and which types the timeline starts on.
export const filters = [
  {
    name: "Werkervaring",
    type: "Experience",
    icon: faBriefcase,
    defaultActive: true,
  },
  {
    name: "Gereedschap",
    type: "Skill",
    icon: faWrench,
    defaultActive: true,
  },
  {
    name: "Opleidingen",
    type: "Education",
    icon: faGraduationCap,
    defaultActive: true,
  },
  // Off by default: the 56 clients bury everything else on first load.
  {
    name: "Klanten",
    type: "Client",
    icon: faUser,
    defaultActive: false,
  },
];

// The timeline marker and the filter share one icon per type, so the filter bar
// doubles as the legend for the markers on the rail.
export const iconForType = (type) =>
  filters.find((filter) => filter.type === type)?.icon;
