// The "next client" placeholder that caps the top of the rail.
//
// This used to be a Contentful entry typed as a Client, dated far in the future
// (2123) purely so it would sort first under `order: [from_DESC]`. It isn't real
// content, so it lives here instead. It has no type in `filters`, which means it
// renders with an empty ring rather than a type icon.
export const PLACEHOLDER_TYPE = `Placeholder`;

export const nextClientPlaceholder = {
  sys: { id: `placeholder-next-client` },
  title: `Loading...`,
  type: PLACEHOLDER_TYPE,
};
