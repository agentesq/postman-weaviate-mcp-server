import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to update a tenant in Weaviate.
 *
 * @param {Object} args - Arguments for updating the tenant.
 * @param {string} args.className - The name of the class for which the tenant is being updated.
 * @param {Array<Object>} args.tenants - An array of tenant objects to update, each containing a name and activityStatus.
 * @returns {Promise<Object>} - The result of the tenant update operation.
 */
const executeFunction = async ({ className, tenants }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL for the tenant update
    const url = `${baseUrl}/schema/${className}/tenants`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(tenants)
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
    console.error('Error updating tenant:', error);
    return { error: 'An error occurred while updating the tenant.' };
  }
};

/**
 * Tool configuration for updating a tenant in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_tenant',
      description: 'Update a tenant in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class for which the tenant is being updated.'
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
                  enum: ['COLD', 'ACTIVE', 'INACTIVE'],
                  description: 'The activity status of the tenant.'
                }
              },
              required: ['name', 'activityStatus']
            },
            description: 'An array of tenant objects to update.'
          }
        },
        required: ['className', 'tenants']
      }
    }
  }
};

export { apiTool };