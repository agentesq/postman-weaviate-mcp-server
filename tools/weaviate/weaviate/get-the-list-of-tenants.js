import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get the list of tenants from a specified class in Weaviate.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.className - The name of the class to get tenants from.
 * @returns {Promise<Object>} - The result of the tenant retrieval.
 */
const executeFunction = async ({ className }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const consistency = true; // Consistency flag
  const acceptHeader = 'application/json'; // Accept header for response

  try {
    // Construct the URL with the class name
    const url = `${baseUrl}/schema/${className}/tenants`;

    // Set up headers for the request
    const headers = {
      'Consistency': consistency.toString(),
      'Accept': acceptHeader
    ,
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
    console.error('Error retrieving tenants:', error);
    return { error: 'An error occurred while retrieving tenants.' };
  }
};

/**
 * Tool configuration for retrieving tenants from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_tenants',
      description: 'Get the list of tenants from a specified class in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class to get tenants from.'
          }
        },
        required: ['className']
      }
    }
  }
};

export { apiTool };