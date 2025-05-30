import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to remove a collection from the Weaviate schema.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.className - The name of the class to be removed from the schema.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ className }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/schema/${className}`;
  
  try {
    // Set up headers for the request
    const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return { message: data };
  } catch (error) {
    console.error('Error removing collection:', error);
    return { error: 'An error occurred while removing the collection.' };
  }
};

/**
 * Tool configuration for removing a collection from the Weaviate schema.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'remove_collection',
      description: 'Remove a collection from the Weaviate schema.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class to be removed from the schema.'
          }
        },
        required: ['className']
      }
    }
  }
};

export { apiTool };