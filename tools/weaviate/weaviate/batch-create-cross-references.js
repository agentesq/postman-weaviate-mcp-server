import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to batch create cross-references in Weaviate.
 *
 * @param {Array<Object>} references - An array of reference objects to create.
 * @param {string} references[].from - The URI of the source object.
 * @param {string} references[].to - The URI of the target object.
 * @param {string} references[].tenant - The tenant identifier.
 * @returns {Promise<Object>} - The result of the batch creation request.
 */
const executeFunction = async (references) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/batch/references?consistency_level=QUORUM`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(references)
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
    console.error('Error creating cross-references:', error);
    return { error: 'An error occurred while creating cross-references.' };
  }
};

/**
 * Tool configuration for batch creating cross-references in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'batch_create_cross_references',
      description: 'Batch create cross-references between collections items in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          references: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: {
                  type: 'string',
                  description: 'The URI of the source object.'
                },
                to: {
                  type: 'string',
                  description: 'The URI of the target object.'
                },
                tenant: {
                  type: 'string',
                  description: 'The tenant identifier.'
                }
              },
              required: ['from', 'to', 'tenant']
            },
            description: 'An array of reference objects to create.'
          }
        },
        required: ['references']
      }
    }
  }
};

export { apiTool };