import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to create a new tenant in Weaviate.
 *
 * @param {Object} args - Arguments for creating a tenant.
 * @param {string} args.className - The name of the class for which the tenant is being created.
 * @param {Array<Object>} args.tenants - An array of tenant objects to be created.
 * @param {string} args.tenants[].name - The name of the tenant.
 * @param {string} [args.tenants[].activityStatus="COLD"] - The activity status of the tenant.
 * @returns {Promise<Object>} - The result of the tenant creation.
 */
const executeFunction = async ({ className, tenants }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  const url = `${baseUrl}/schema/${className}/tenants`;

  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Prepare the request body
    const body = JSON.stringify(tenants);

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
    console.error('Error creating tenant:', error);
    return { error: 'An error occurred while creating the tenant.' };
  }
};

/**
 * Tool configuration for creating a new tenant in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_tenant',
      description: 'Create a new tenant in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class for which the tenant is being created.'
          },
          tenants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the tenant.'
                },
                activityStatus: {
                  type: 'string',
                  description: 'The activity status of the tenant.'
                }
              },
              required: ['name']
            },
            description: 'An array of tenant objects to be created.'
          }
        },
        required: ['className', 'tenants']
      }
    }
  }
};

export { apiTool };