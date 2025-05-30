import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to perform batched GraphQL queries on Weaviate.
 *
 * @param {Array<Object>} queries - An array of query objects to be executed.
 * @param {string} queries[].operationName - The name of the operation.
 * @param {string} queries[].query - The GraphQL query string.
 * @param {Object} [queries[].variables={}] - The variables for the GraphQL query.
 * @returns {Promise<Object>} - The result of the batched GraphQL queries.
 */
const executeFunction = async (queries) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Perform the fetch request
    const response = await fetch(`${baseUrl}/graphql/batch`, {
      method: 'POST',
      headers,
      body: JSON.stringify(queries)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error performing batched GraphQL queries:', error);
    return { error: 'An error occurred while performing batched GraphQL queries.' };
  }
};

/**
 * Tool configuration for performing batched GraphQL queries on Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'perform_batched_graphql_queries',
      description: 'Perform batched GraphQL queries on Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          queries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                operationName: {
                  type: 'string',
                  description: 'The name of the operation.'
                },
                query: {
                  type: 'string',
                  description: 'The GraphQL query string.'
                },
                variables: {
                  type: 'object',
                  description: 'The variables for the GraphQL query.'
                }
              },
              required: ['operationName', 'query']
            },
            description: 'An array of query objects to be executed.'
          }
        },
        required: ['queries']
      }
    }
  }
};

export { apiTool };