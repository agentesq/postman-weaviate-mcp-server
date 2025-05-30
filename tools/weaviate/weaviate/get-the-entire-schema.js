import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get the entire schema from Weaviate.
 *
 * @returns {Promise<Object>} - The schema of the Weaviate database.
 */
const executeFunction = async () => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const consistency = 'true';
  const acceptHeader = 'application/json';

  try {
    // Construct the URL for the schema endpoint
    const url = `${baseUrl}/schema`;

    // Set up headers for the request
    const headers = {
      'Consistency': consistency,
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
    console.error('Error fetching schema:', error);
    return { error: 'An error occurred while fetching the schema.' };
  }
};

/**
 * Tool configuration for getting the entire schema from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_schema',
      description: 'Fetch the entire schema from Weaviate.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };