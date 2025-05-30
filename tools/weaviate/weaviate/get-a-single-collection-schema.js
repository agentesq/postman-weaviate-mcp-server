import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to get the schema of a specific class in Weaviate.
 *
 * @param {Object} args - Arguments for the schema retrieval.
 * @param {string} args.className - The name of the class whose schema is to be retrieved.
 * @returns {Promise<Object>} - The schema of the specified class.
 */
const executeFunction = async ({ className }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const headers = {
    'consistency': 'true',
    'Accept': 'application/json',
      'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

  try {
    // Construct the URL with the class name
    const url = `${baseUrl}/schema/${className}`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
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
    console.error('Error retrieving schema:', error);
    return { error: 'An error occurred while retrieving the schema.' };
  }
};

/**
 * Tool configuration for retrieving class schema in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_class_schema',
      description: 'Get the schema of a specific class in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class whose schema is to be retrieved.'
          }
        },
        required: ['className']
      }
    }
  }
};

export { apiTool };