import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to view a previously created classification in Weaviate.
 *
 * @param {Object} args - Arguments for the classification retrieval.
 * @param {string} args.id - The ID of the classification to retrieve.
 * @returns {Promise<Object>} - The result of the classification retrieval.
 */
const executeFunction = async ({ id }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL with the classification ID
    const url = `${baseUrl}/classifications/${id}`;

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
    console.error('Error retrieving classification:', error);
    return { error: 'An error occurred while retrieving the classification.' };
  }
};

/**
 * Tool configuration for viewing a classification in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_classification',
      description: 'Retrieve a previously created classification from Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the classification to retrieve.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };