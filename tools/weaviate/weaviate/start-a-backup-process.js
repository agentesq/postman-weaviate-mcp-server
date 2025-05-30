import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to start a backup process in Weaviate.
 *
 * @param {Object} args - Arguments for the backup process.
 * @param {string} args.backend - The backup backend name (e.g., `filesystem`, `gcs`, `s3`, `azure`).
 * @param {string} args.id - The unique identifier for the backup.
 * @param {Object} args.config - Configuration settings for the backup.
 * @param {number} args.config.CPUPercentage - The percentage of CPU to allocate for the backup process.
 * @param {number} args.config.ChunkSize - The size of chunks for the backup.
 * @param {string} args.config.CompressionLevel - The level of compression to use.
 * @param {Array<string>} args.include - An array of strings specifying which collections to include in the backup.
 * @param {Array<string>} args.exclude - An array of strings specifying which collections to exclude from the backup.
 * @returns {Promise<Object>} - The result of the backup process initiation.
 */
const executeFunction = async ({ backend, id, config, include, exclude }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/backups/${backend}`;
  const data = {
    id,
    config,
    include,
    exclude
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
    console.error('Error starting backup process:', error);
    return { error: 'An error occurred while starting the backup process.' };
  }
};

/**
 * Tool configuration for starting a backup process in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'start_backup_process',
      description: 'Start a backup process in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          backend: {
            type: 'string',
            description: 'The backup backend name (e.g., `filesystem`, `gcs`, `s3`, `azure`).'
          },
          id: {
            type: 'string',
            description: 'The unique identifier for the backup.'
          },
          config: {
            type: 'object',
            properties: {
              CPUPercentage: {
                type: 'integer',
                description: 'The percentage of CPU to allocate for the backup process.'
              },
              ChunkSize: {
                type: 'integer',
                description: 'The size of chunks for the backup.'
              },
              CompressionLevel: {
                type: 'string',
                description: 'The level of compression to use.'
              }
            },
            required: ['CPUPercentage', 'ChunkSize', 'CompressionLevel']
          },
          include: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of strings specifying which collections to include in the backup.'
          },
          exclude: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of strings specifying which collections to exclude from the backup.'
          }
        },
        required: ['backend', 'id', 'config']
      }
    }
  }
};

export { apiTool };