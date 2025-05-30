import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to start a restoration process for a backup in Weaviate.
 *
 * @param {Object} args - Arguments for the restoration process.
 * @param {string} args.backend - The backup backend name (e.g., `filesystem`, `gcs`, `s3`, `azure`).
 * @param {string} args.id - The ID of the backup to restore.
 * @param {number} [args.CPUPercentage=50] - The percentage of CPU to allocate for the restoration process.
 * @param {Array<string>} [args.include=[]] - An array of strings specifying which collections to include in the restoration.
 * @param {Array<string>} [args.exclude=[]] - An array of strings specifying which collections to exclude from the restoration.
 * @param {Object} [args.node_mapping={}] - A mapping of node names for the restoration process.
 * @returns {Promise<Object>} - The result of the restoration process.
 */
const executeFunction = async ({ backend, id, CPUPercentage = 50, include = [], exclude = [], node_mapping = {} }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/backups/${backend}/${id}/restore`;
  const data = {
    config: {
      CPUPercentage
    },
    include,
    exclude,
    node_mapping
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      ,
        'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error starting restoration process:', error);
    return { error: 'An error occurred while starting the restoration process.' };
  }
};

/**
 * Tool configuration for starting a restoration process in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'start_restoration_process',
      description: 'Starts a restoration process for a backup in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          backend: {
            type: 'string',
            description: 'The backup backend name (e.g., `filesystem`, `gcs`, `s3`, `azure`).'
          },
          id: {
            type: 'string',
            description: 'The ID of the backup to restore.'
          },
          CPUPercentage: {
            type: 'integer',
            description: 'The percentage of CPU to allocate for the restoration process.'
          },
          include: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of strings specifying which collections to include in the restoration.'
          },
          exclude: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of strings specifying which collections to exclude from the restoration.'
          },
          node_mapping: {
            type: 'object',
            description: 'A mapping of node names for the restoration process.'
          }
        },
        required: ['backend', 'id']
      }
    }
  }
};

export { apiTool };