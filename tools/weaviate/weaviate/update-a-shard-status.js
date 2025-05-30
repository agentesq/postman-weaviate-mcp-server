import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to update the status of a shard in Weaviate.
 *
 * @param {Object} args - Arguments for updating the shard status.
 * @param {string} args.className - The name of the class associated with the shard.
 * @param {string} args.shardName - The name of the shard to update.
 * @param {string} args.status - The new status for the shard (e.g., "READY", "READONLY").
 * @returns {Promise<Object>} - The result of the shard status update.
 */
const executeFunction = async ({ className, shardName, status }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  const url = `${baseUrl}/schema/${className}/shards/${shardName}`;
  
  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Prepare the request body
    const body = JSON.stringify({ status });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
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
    console.error('Error updating shard status:', error);
    return { error: 'An error occurred while updating shard status.' };
  }
};

/**
 * Tool configuration for updating shard status in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_shard_status',
      description: 'Update the status of a shard in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class associated with the shard.'
          },
          shardName: {
            type: 'string',
            description: 'The name of the shard to update.'
          },
          status: {
            type: 'string',
            description: 'The new status for the shard (e.g., "READY", "READONLY").'
          }
        },
        required: ['className', 'shardName', 'status']
      }
    }
  }
};

export { apiTool };
