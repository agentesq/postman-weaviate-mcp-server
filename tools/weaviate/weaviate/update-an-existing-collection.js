import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to update an existing collection in Weaviate.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.className - The name of the class to update.
 * @param {Object} args.config - The new configuration for the class.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ className, config }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL for the PUT request
    const url = `${baseUrl}/schema/${className}`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(config)
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
    console.error('Error updating collection:', error);
    return { error: 'An error occurred while updating the collection.' };
  }
};

/**
 * Tool configuration for updating a collection in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_collection',
      description: 'Update an existing collection in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class to update.'
          },
          config: {
            type: 'object',
            description: 'The new configuration for the class.'
          }
        },
        required: ['className', 'config']
      }
    }
  }
};

export { apiTool };