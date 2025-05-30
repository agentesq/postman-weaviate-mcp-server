import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get instance metadata from Weaviate.
 *
 * @returns {Promise<Object>} - The metadata of the Weaviate instance.
 */
const executeFunction = async () => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Perform the fetch request
    const response = await fetch(`${baseUrl}/meta`, {
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
    console.error('Error fetching instance metadata:', error);
    return { error: 'An error occurred while fetching instance metadata.' };
  }
};

/**
 * Tool configuration for getting instance metadata from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_instance_metadata',
      description: 'Get instance metadata from Weaviate.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };
