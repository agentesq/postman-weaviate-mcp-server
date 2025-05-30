import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to retrieve node information for a specific class in Weaviate.
 *
 * @param {Object} args - Arguments for the node information retrieval.
 * @param {string} args.className - The name of the class for which to retrieve node information.
 * @returns {Promise<Object>} - The result of the node information retrieval.
 */
const executeFunction = async ({ className }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/nodes/${className}?output=minimal`;

  try {
    // Set up headers for the request
    const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
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
    console.error('Error retrieving node information:', error);
    return { error: 'An error occurred while retrieving node information.' };
  }
};

/**
 * Tool configuration for retrieving node information in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_node_info',
      description: 'Retrieve node information for a specific class in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class for which to retrieve node information.'
          }
        },
        required: ['className']
      }
    }
  }
};

export { apiTool };