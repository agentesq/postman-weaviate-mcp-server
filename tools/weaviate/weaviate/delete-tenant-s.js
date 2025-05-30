import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to delete tenants from a specified class in Weaviate.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.className - The name of the class from which to delete tenants.
 * @param {Array<string>} args.tenantIds - An array of tenant IDs to delete.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ className, tenantIds }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };
  
  const url = `${baseUrl}/schema/${className}/tenants`;
  
  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(tenantIds)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Return the response data
    return await response.text();
  } catch (error) {
    console.error('Error deleting tenants:', error);
    return { error: 'An error occurred while deleting tenants.' };
  }
};

/**
 * Tool configuration for deleting tenants from a specified class in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_tenants',
      description: 'Delete tenants from a specified class in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class from which to delete tenants.'
          },
          tenantIds: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of tenant IDs to delete.'
          }
        },
        required: ['className', 'tenantIds']
      }
    }
  }
};

export { apiTool };