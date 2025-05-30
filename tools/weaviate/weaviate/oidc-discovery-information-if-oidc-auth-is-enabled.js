import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to retrieve OIDC discovery information from Weaviate.
 *
 * @returns {Promise<Object>} - The OIDC discovery information or an error message.
 */
const executeFunction = async () => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  try {
    // Construct the URL for the OIDC discovery endpoint
    const url = `${baseUrl}/.well-known/openid-configuration`;

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
    console.error('Error retrieving OIDC discovery information:', error);
    return { error: 'An error occurred while retrieving OIDC discovery information.' };
  }
};

/**
 * Tool configuration for retrieving OIDC discovery information from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_oidc_discovery_info',
      description: 'Retrieve OIDC discovery information from Weaviate.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };