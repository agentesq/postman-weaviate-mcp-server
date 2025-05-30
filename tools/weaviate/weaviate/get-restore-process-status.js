import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get the status of a backup restoration process in Weaviate.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.backend - The backup backend name (e.g., `filesystem`, `gcs`, `s3`, `azure`).
 * @param {string} args.id - The ID of the backup. Must be URL-safe and work as a filesystem path.
 * @returns {Promise<Object>} - The result of the backup restoration status request.
 */
const executeFunction = async ({ backend, id }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL with path variables
    const url = `${baseUrl}/backups/${encodeURIComponent(backend)}/${encodeURIComponent(id)}/restore`;

    // Set up headers for the request
    const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
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
    console.error('Error getting backup restoration status:', error);
    return { error: 'An error occurred while getting the backup restoration status.' };
  }
};

/**
 * Tool configuration for getting the status of a backup restoration process in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_restore_process_status',
      description: 'Get the status of a backup restoration process in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          backend: {
            type: 'string',
            description: 'The backup backend name (e.g., `filesystem`, `gcs`, `s3`, `azure`).'
          },
          id: {
            type: 'string',
            description: 'The ID of the backup. Must be URL-safe and work as a filesystem path.'
          }
        },
        required: ['backend', 'id']
      }
    }
  }
};

export { apiTool };