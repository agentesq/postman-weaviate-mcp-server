import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get the status of a backup process in Weaviate.
 *
 * @param {Object} args - Arguments for the backup status request.
 * @param {string} args.backend - The backup backend name (e.g., filesystem, gcs, s3).
 * @param {string} args.id - The ID of the backup, must be URL-safe and lowercase.
 * @returns {Promise<Object>} - The status of the backup process.
 */
const executeFunction = async ({ backend, id }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL with path parameters
    const url = `${baseUrl}/backups/${encodeURIComponent(backend)}/${encodeURIComponent(id)}`;

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
    console.error('Error getting backup status:', error);
    return { error: 'An error occurred while retrieving the backup status.' };
  }
};

/**
 * Tool configuration for getting the backup process status in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_backup_status',
      description: 'Get the status of a backup process in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          backend: {
            type: 'string',
            description: 'The backup backend name (e.g., filesystem, gcs, s3).'
          },
          id: {
            type: 'string',
            description: 'The ID of the backup, must be URL-safe and lowercase.'
          }
        },
        required: ['backend', 'id']
      }
    }
  }
};

export { apiTool };