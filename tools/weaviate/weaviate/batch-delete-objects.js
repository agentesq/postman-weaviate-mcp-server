import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to batch delete objects in Weaviate based on a specified filter.
 *
 * @param {Object} args - Arguments for the batch delete operation.
 * @param {string} args.class - The class of objects to delete.
 * @param {Object} args.where - The filter criteria for selecting objects to delete.
 * @param {string} args.consistency_level - Determines how many replicas must acknowledge a request before it is considered successful.
 * @param {string} args.tenant - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the batch delete operation.
 */
const executeFunction = async ({ class: className, where, consistency_level = 'QUORUM', tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/batch/objects`);
    url.searchParams.append('consistency_level', consistency_level);
    url.searchParams.append('tenant', tenant);

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Construct the request body
    const body = JSON.stringify({
      match: {
        class: className,
        where: where
      },
      output: 'minimal',
      dryRun: false
    });

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers,
      body
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
    console.error('Error deleting objects:', error);
    return { error: 'An error occurred while deleting objects.' };
  }
};

/**
 * Tool configuration for batch deleting objects in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'batch_delete_objects',
      description: 'Batch delete objects in Weaviate based on a specified filter.',
      parameters: {
        type: 'object',
        properties: {
          class: {
            type: 'string',
            description: 'The class of objects to delete.'
          },
          where: {
            type: 'object',
            description: 'The filter criteria for selecting objects to delete.'
          },
          consistency_level: {
            type: 'string',
            description: 'Determines how many replicas must acknowledge a request before it is considered successful.'
          },
          tenant: {
            type: 'string',
            description: 'Specifies the tenant in a request targeting a multi-tenant collection.'
          }
        },
        required: ['class', 'where', 'tenant']
      }
    }
  }
};

export { apiTool };