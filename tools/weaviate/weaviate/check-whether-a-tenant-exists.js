import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to check whether a tenant exists for a specific class in Weaviate.
 *
 * @param {Object} args - Arguments for the tenant check.
 * @param {string} args.className - The name of the class to check.
 * @param {string} args.tenantName - The name of the tenant to check.
 * @returns {Promise<Object>} - The result of the tenant existence check.
 */
const executeFunction = async ({ className, tenantName }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const consistency = 'true'; // Header for consistency
  const acceptHeader = 'application/json'; // Header for response format

  try {
    // Construct the URL with path parameters
    const url = `${baseUrl}/schema/${encodeURIComponent(className)}/tenants/${encodeURIComponent(tenantName)}`;

    // Set up headers for the request
    const headers = {
      'consistency': consistency,
      'Accept': acceptHeader
    ,
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'HEAD',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    // Return a success message if the tenant exists
    return { message: 'The tenant exists in the specified class.' };
  } catch (error) {
    console.error('Error checking tenant existence:', error);
    return { error: 'An error occurred while checking tenant existence.' };
  }
};

/**
 * Tool configuration for checking tenant existence in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_tenant_exists',
      description: 'Check if a tenant exists for a specific class in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class to check.'
          },
          tenantName: {
            type: 'string',
            description: 'The name of the tenant to check.'
          }
        },
        required: ['className', 'tenantName']
      }
    }
  }
};

export { apiTool };