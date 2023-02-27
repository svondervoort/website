import {GRAPH_TOKEN, GRAPH_URL} from "./constants";

export async function loadData() {
    try {
        const headers = {
            'content-type': 'application/json',
            'Authorization': `Bearer ${GRAPH_TOKEN}`
        };

        const requestBody = {
            query: `
            query {
              skillCategoryCollection(limit: 20, order: [order_ASC]) {
                items {
                    sys {
                  id
                }
                  title,
                  skillCollection(limit: 20) {
                    items {
                        sys {
                            id
                        }
                        title,
                        rating
                    }
                  }
                }
              }
              educationCollection(limit: 20, order: [from_ASC]) {
                  items {
                        sys {
                            id
                        },
                      title,
                      location,
                      from,
                      till,
                      level,
                      description
                  }
              }
              experienceCollection(limit: 20, order: [from_ASC]) {
                  items {
                        sys {
                            id
                        },
                      title,
                      type,
                      location,
                      from,
                      till,
                      description,
                      clientsCollection(limit: 20) {
                          items {
                              title
                          }
                      }
                  }
              }
            }
            `
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        };

        const response = await (await fetch(GRAPH_URL, options)).json();
        return response?.data;
    } catch (err) {
        console.log('ERROR DURING FETCH REQUEST', err);
    }
}
