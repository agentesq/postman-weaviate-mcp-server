import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to delete a cross-reference from a Weaviate object.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.className - The class name as defined in the schema.
 * @param {string} args.id - Unique ID of the Object.
 * @param {string} args.propertyName - Unique name of the property related to the Object.
 * @param {string} args.tenant - Specifies the tenant in a request targeting a multi-tenant collection.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ className, id, propertyName, tenant }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const requestBody = {
    class: "<uri>",
    schema: {},
    beacon: "<uri>",
    href: "<uri>",
    classification: {
      overallCount: "<number>",
      winningCount: "<number>",
      losingCount: "<number>",
      closestOverallDistance: "<number>",
      winningDistance: "<number>",
      meanWinningDistance: "<number>",
      closestWinningDistance: "<number>",
      closestLosingDistance: "<number>",
      losingDistance: "<number>",
      meanLosingDistance: "<number>"
    }
  };
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Construct the URL with path variables
    const url = `${baseUrl}/objects/${className}/${id}/references/${propertyName}?consistency_level=QUORUM&tenant=${tenant}`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(requestBody)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Return the response status
    return { status: response.status, message: 'Successfully deleted.' };
  } catch (error) {
    console.error('Error deleting cross-reference:', error);
    return { error: 'An error occurred while deleting the cross-reference.' };
  }
};

/**
 * Tool configuration for deleting a cross-reference from a Weaviate object.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_cross_reference',
      description: 'Delete a cross-reference from a Weaviate object.',
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
          tenant: {
            type: 'string',
            description: 'Specifies the tenant in a request targeting a multi-tenant collection.'
          }
        },
        required: ['className', 'id', 'propertyName', 'tenant']
      }
    }
  }
};

export { apiTool };