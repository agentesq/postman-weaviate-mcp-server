import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get the shard status from Weaviate.
 *
 * @param {Object} args - Arguments for the shard status request.
 * @param {string} args.className - The name of the class to get the shard status for.
 * @param {string} args.tenant - The tenant identifier.
 * @returns {Promise<Object>} - The status of the shards in the cluster.
 */
const executeFunction = async ({ className, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Construct the URL with path and query parameters
    const url = new URL(`${baseUrl}/schema/${className}/shards`);
    url.searchParams.append('tenant', tenant);

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
    console.error('Error getting shard status:', error);
    return { error: 'An error occurred while getting shard status.' };
  }
};

/**
 * Tool configuration for getting the shard status from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_shard_status',
      description: 'Get the status of every shard in the cluster.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class to get the shard status for.'
          },
          tenant: {
            type: 'string',
            description: 'The tenant identifier.'
          }
        },
        required: ['className', 'tenant']
      }
    }
  }
};

export { apiTool };