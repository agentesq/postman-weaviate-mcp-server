import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to check the liveness of the Weaviate application.
 *
 * @returns {Promise<Object>} - The result of the liveness check.
 */
const executeFunction = async () => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  try {
    // Construct the URL for the liveness check
    const url = `${baseUrl}/.well-known/live`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET'
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return { status: 'OK', message: data };
  } catch (error) {
    console.error('Error checking application liveness:', error);
    return { error: 'An error occurred while checking application liveness.' };
  }
};

/**
 * Tool configuration for checking the liveness of the Weaviate application.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_liveness',
      description: 'Check if the Weaviate application is alive.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };