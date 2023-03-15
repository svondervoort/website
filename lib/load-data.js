import { GRAPH_TOKEN, GRAPH_URL } from "./constants";

export async function loadData() {
  try {
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${GRAPH_TOKEN}`,
    };

    const requestBody = {
      query: `
            query {
  timelineCollection(limit: 99, order: [from_DESC]) {
    items {
        sys {
            id
        },
        title,
        location,
        from,
        till,
        badges,
        type,
        description,
        rating,
    }
}
}
            `,
    };

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    };

    const response = await (await fetch(GRAPH_URL, options)).json();
    return response?.data;
  } catch (err) {
    console.log("ERROR DURING FETCH REQUEST", err);
  }
}
