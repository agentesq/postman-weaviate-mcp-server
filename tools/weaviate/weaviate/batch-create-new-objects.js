import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to batch create new objects in Weaviate.
 *
 * @param {Object} args - The arguments for creating new objects.
 * @param {Array} args.objects - An array of objects to be created, each containing class, id, creationTimeUnix, lastUpdateTimeUnix, vector, vectors, tenant, and additional properties.
 * @param {Array} [args.fields=["ALL"]] - The fields to include in the request.
 * @param {string} [args.consistency_level="QUORUM"] - The consistency level for the request.
 * @returns {Promise<Object>} - The result of the batch creation request.
 */
const executeFunction = async ({ objects, fields = ["ALL"], consistency_level = "QUORUM" }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  const url = `${baseUrl}/batch/objects?consistency_level=${consistency_level}`;

  const body = JSON.stringify({ fields, objects });

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
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
    console.error('Error creating objects in batch:', error);
    return { error: 'An error occurred while creating objects in batch.' };
  }
};

/**
 * Tool configuration for batch creating new objects in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'batch_create_objects',
      description: 'Batch create new objects in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          objects: {
            type: 'array',
            description: 'An array of objects to be created.'
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description: 'The fields to include in the request.'
          },
          consistency_level: {
            type: 'string',
            description: 'The consistency level for the request.'
          }
        },
        required: ['objects']
      }
    }
  }
};

export { apiTool };