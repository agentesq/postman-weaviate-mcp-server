import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to add a cross-reference to an object in Weaviate.
 *
 * @param {Object} args - Arguments for adding a cross-reference.
 * @param {string} args.className - The class name as defined in the schema.
 * @param {string} args.id - Unique ID of the Object.
 * @param {string} args.propertyName - Unique name of the property related to the Object.
 * @param {Object} args.referenceData - The reference data to be added.
 * @param {string} args.tenant - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the cross-reference addition.
 */
const executeFunction = async ({ className, id, propertyName, referenceData, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/objects/${className}/${id}/references/${propertyName}?consistency_level=QUORUM&tenant=${tenant}`;
  const token = process.env.WEAVIATE_API_KEY;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    const body = JSON.stringify(referenceData);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding cross-reference:', error);
    return { error: 'An error occurred while adding the cross-reference.' };
  }
};

/**
 * Tool configuration for adding a cross-reference in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_cross_reference',
      description: 'Add a cross-reference to an object in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The class name as defined in the schema.'
          },
          id: {
            type: 'string',
            description: 'Unique ID of the Object.'
          },
          propertyName: {
            type: 'string',
            description: 'Unique name of the property related to the Object.'
          },
          referenceData: {
            type: 'object',
            description: 'The reference data to be added.'
          },
          tenant: {
            type: 'string',
            description: 'Specifies the tenant in a request targeting a multi-tenant collection.'
          }
        },
        required: ['className', 'id', 'propertyName', 'referenceData', 'tenant']
      }
    }
  }
};

export { apiTool };