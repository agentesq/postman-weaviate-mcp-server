import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to update an object in Weaviate.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.className - The class name of the object to update.
 * @param {string} args.id - The UUID of the object to update.
 * @param {Object} args.objectData - The data to update the object with.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ className, id, objectData }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL for the PUT request
    const url = `${baseUrl}/objects/${className}/${id}?consistency_level=QUORUM`;

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
      body: JSON.stringify(objectData)
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
      description: 'Update an object in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The class name of the object to update.'
          },
          id: {
            type: 'string',
            description: 'The UUID of the object to update.'
          },
          objectData: {
            type: 'object',
            description: 'The data to update the object with.'
          }
        },
        required: ['className', 'id', 'objectData']
      }
    }
  }
};

export { apiTool };