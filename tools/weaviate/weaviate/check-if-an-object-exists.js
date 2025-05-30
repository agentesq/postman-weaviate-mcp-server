import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to check if an object exists in Weaviate.
 *
 * @param {Object} args - Arguments for the object existence check.
 * @param {string} args.className - The class name as defined in the schema.
 * @param {string} args.id - The UUID of the data object.
 * @param {string} [args.tenant] - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the existence check.
 */
const executeFunction = async ({ className, id, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  // Construct the URL with path variables and query parameters
  const url = new URL(`${baseUrl}/objects/${className}/${id}`);
  url.searchParams.append('consistency_level', 'QUORUM');
  if (tenant) {
    url.searchParams.append('tenant', tenant);
  }

  try {
    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'HEAD',
      headers
    });

    // Check if the response was successful
    if (response.status === 204) {
      return { exists: true };
    } else if (response.status === 404) {
      return { exists: false };
    } else {
      const errorData = await response.json();
      throw new Error(errorData);
    }
  } catch (error) {
    console.error('Error checking object existence:', error);
    return { error: 'An error occurred while checking object existence.' };
  }
};

/**
 * Tool configuration for checking object existence in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_object_exists',
      description: 'Check if an object exists in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The class name as defined in the schema.'
          },
          id: {
            type: 'string',
            description: 'The UUID of the data object.'
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