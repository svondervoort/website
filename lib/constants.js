const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? `master`;

export const GRAPH_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
export const GRAPH_URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;
