import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to update an object in Weaviate using patch semantics.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.className - The class name as defined in the schema.
 * @param {string} args.id - The UUID of the data object to update.
 * @param {Object} args.data - The data to update the object with, following the patch semantics.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ className, id, data }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Construct the URL with path variables
    const url = `${baseUrl}/objects/${className}/${id}?consistency_level=QUORUM`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating object:', error);
    return { error: 'An error occurred while updating the object.' };
  }
};

/**
 * Tool configuration for updating an object in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_object',
      description: 'Update an object in Weaviate using patch semantics.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The class name as defined in the schema.'
          },
          id: {
            type: 'string',
            description: 'The UUID of the data object to update.'
          },
          data: {
            type: 'object',
            description: 'The data to update the object with, following the patch semantics.'
          }
        },
        required: ['className', 'id', 'data']
      }
    }
  }
};

export { apiTool };