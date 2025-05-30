import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get an object from Weaviate based on its class name and UUID.
 *
 * @param {Object} args - Arguments for the object retrieval.
 * @param {string} args.className - The class name of the object to retrieve.
 * @param {string} args.id - The UUID of the object to retrieve.
 * @param {string} [args.include] - Additional information to include in the response.
 * @param {string} [args.node_name] - The target node which should fulfill the request.
 * @param {string} [args.tenant] - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the object retrieval.
 */
const executeFunction = async ({ className, id, include, node_name, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL with path and query parameters
    const url = new URL(`${baseUrl}/objects/${className}/${id}`);
    if (include) url.searchParams.append('include', include);
    url.searchParams.append('consistency_level', 'QUORUM');
    if (node_name) url.searchParams.append('node_name', node_name);
    if (tenant) url.searchParams.append('tenant', tenant);

    // Set up headers for the request
    const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
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
    console.error('Error retrieving object:', error);
    return { error: 'An error occurred while retrieving the object.' };
  }
};

/**
 * Tool configuration for retrieving an object from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_object',
      description: 'Get a data object based on its class name and UUID.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The class name of the object to retrieve.'
          },
          id: {
            type: 'string',
            description: 'The UUID of the object to retrieve.'
          },
          include: {
            type: 'string',
            description: 'Include additional information, such as classification infos.'
          },
          node_name: {
            type: 'string',
            description: 'The target node which should fulfill the request.'
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