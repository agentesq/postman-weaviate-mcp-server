import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to validate an object in Weaviate.
 *
 * @param {Object} args - The object to validate.
 * @param {string} args.class - The class of the object.
 * @param {Object} args.vectorWeights - The weights for the vectors.
 * @param {Object} args.properties - The properties of the object.
 * @param {string} args.id - The unique identifier for the object.
 * @param {number} args.creationTimeUnix - The creation time in Unix timestamp.
 * @param {number} args.lastUpdateTimeUnix - The last update time in Unix timestamp.
 * @param {Array<number>} args.vector - The vector representation of the object.
 * @param {Object} args.vectors - Additional vectors for the object.
 * @param {string} args.tenant - The tenant for the object.
 * @param {Object} args.additional - Additional metadata for the object.
 * @returns {Promise<Object>} - The result of the validation.
 */
const executeFunction = async ({
  class: objectClass,
  vectorWeights,
  properties,
  id,
  creationTimeUnix,
  lastUpdateTimeUnix,
  vector,
  vectors,
  tenant,
  additional
}) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  const requestBody = {
    class: objectClass,
    vectorWeights,
    properties,
    id,
    creationTimeUnix,
    lastUpdateTimeUnix,
    vector,
    vectors,
    tenant,
    additional
  };

  try {
    // Perform the fetch request
    const response = await fetch(`${baseUrl}/objects/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(requestBody)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Return the response data
    return await response.json();
  } catch (error) {
    console.error('Error validating object:', error);
    return { error: 'An error occurred while validating the object.' };
  }
};

/**
 * Tool configuration for validating an object in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'validate_object',
      description: 'Validate an object\'s schema and meta-data without creating it.',
      parameters: {
        type: 'object',
        properties: {
          class: {
            type: 'string',
            description: 'The class of the object.'
          },
          vectorWeights: {
            type: 'object',
            description: 'The weights for the vectors.'
          },
          properties: {
            type: 'object',
            description: 'The properties of the object.'
          },
          id: {
            type: 'string',
            description: 'The unique identifier for the object.'
          },
          creationTimeUnix: {
            type: 'integer',
            description: 'The creation time in Unix timestamp.'
          },
          lastUpdateTimeUnix: {
            type: 'integer',
            description: 'The last update time in Unix timestamp.'
          },
          vector: {
            type: 'array',
            items: {
              type: 'number'
            },
            description: 'The vector representation of the object.'
          },
          vectors: {
            type: 'object',
            description: 'Additional vectors for the object.'
          },
          tenant: {
            type: 'string',
            description: 'The tenant for the object.'
          },
          additional: {
            type: 'object',
            description: 'Additional metadata for the object.'
          }
        },
        required: ['class', 'id', 'creationTimeUnix', 'lastUpdateTimeUnix', 'vector']
      }
    }
  }
};

export { apiTool };