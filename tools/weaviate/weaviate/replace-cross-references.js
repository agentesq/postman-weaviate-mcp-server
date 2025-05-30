import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to replace cross-references in Weaviate objects.
 *
 * @param {Object} args - Arguments for the replace operation.
 * @param {string} args.className - The class name as defined in the schema.
 * @param {string} args.id - Unique ID of the Object.
 * @param {string} args.propertyName - Unique name of the property related to the Object.
 * @param {Array} args.references - Array of references to replace.
 * @param {string} [args.tenant] - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the replace operation.
 */
const executeFunction = async ({ className, id, propertyName, references, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const url = `${baseUrl}/objects/${className}/${id}/references/${propertyName}?consistency_level=QUORUM${tenant ? `&tenant=${tenant}` : ''}`;
  
  const body = JSON.stringify(references);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      ,
        'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
      },
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error replacing cross-references:', error);
    return { error: 'An error occurred while replacing cross-references.' };
  }
};

/**
 * Tool configuration for replacing cross-references in Weaviate objects.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'replace_cross_references',
      description: 'Replace all references in cross-reference property of an object.',
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
          references: {
            type: 'array',
            description: 'Array of references to replace.'
          },
          tenant: {
            type: 'string',
            description: 'Specifies the tenant in a request targeting a multi-tenant collection.'
          }
        },
        required: ['className', 'id', 'propertyName', 'references']
      }
    }
  }
};

export { apiTool };