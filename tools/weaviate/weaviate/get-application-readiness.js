import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to check the readiness of the Weaviate application.
 *
 * @returns {Promise<Object>} - The readiness status of the application.
 */
const executeFunction = async () => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  try {
    // Construct the URL for the readiness check
    const url = `${baseUrl}/.well-known/ready`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET'
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return { status: response.status, message: data };
  } catch (error) {
    console.error('Error checking application readiness:', error);
    return { error: 'An error occurred while checking application readiness.' };
  }
};

/**
 * Tool configuration for checking the readiness of the Weaviate application.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_weaviate_readiness',
      description: 'Check if the Weaviate application is ready to receive traffic.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };