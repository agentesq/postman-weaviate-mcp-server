import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to delete an object from Weaviate based on its class name and UUID.
 *
 * @param {Object} args - Arguments for the delete operation.
 * @param {string} args.className - The class name of the object to delete.
 * @param {string} args.id - The unique ID of the object to delete.
 * @param {string} [args.tenant] - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
const executeFunction = async ({ className, id, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const consistencyLevel = 'QUORUM';
  const url = new URL(`${baseUrl}/objects/${className}/${id}`);
  url.searchParams.append('consistency_level', consistencyLevel);
  
  if (tenant) {
    url.searchParams.append('tenant', tenant);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      ,
        'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
      }
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Return the response status
    return { status: response.status, message: 'Successfully deleted.' };
  } catch (error) {
    console.error('Error deleting the object:', error);
    return { error: 'An error occurred while deleting the object.' };
  }
};

/**
 * Tool configuration for deleting an object from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_object',
      description: 'Delete an object from Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The class name of the object to delete.'
          },
          id: {
            type: 'string',
            description: 'The unique ID of the object to delete.'
          },
          tenant: {
            type: 'string',
            description: 'Specifies the tenant in a request targeting a multi-tenant collection.'
          }
        },
        required: ['className', 'id']
      }
    }
  }
};

export { apiTool };