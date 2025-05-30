import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to add a property to an existing collection in Weaviate.
 *
 * @param {Object} args - Arguments for adding a property.
 * @param {string} args.className - The name of the class to which the property will be added.
 * @param {Object} args.propertyData - The data for the property being added.
 * @param {string} args.propertyData.name - The name of the property.
 * @param {Array<string>} args.propertyData.dataType - The data types for the property.
 * @param {string} args.propertyData.description - A description of the property.
 * @param {Object} args.propertyData.moduleConfig - Configuration for the module.
 * @param {boolean} args.propertyData.indexInverted - Whether the property should be indexed inverted.
 * @param {boolean} args.propertyData.indexFilterable - Whether the property should be filterable.
 * @param {boolean} args.propertyData.indexSearchable - Whether the property should be searchable.
 * @param {string} args.propertyData.tokenization - The tokenization method for the property.
 * @param {Array<Object>} args.propertyData.nestedProperties - Nested properties for the property.
 * @returns {Promise<Object>} - The result of the property addition.
 */
const executeFunction = async ({ className, propertyData }) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  const url = `${baseUrl}/schema/${className}/properties`;

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
      body: JSON.stringify(propertyData)
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
    console.error('Error adding property:', error);
    return { error: 'An error occurred while adding the property.' };
  }
};

/**
 * Tool configuration for adding a property to a Weaviate collection.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'add_property',
      description: 'Add a property to an existing collection in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          className: {
            type: 'string',
            description: 'The name of the class to which the property will be added.'
          },
          propertyData: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the property.'
              },
              dataType: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'The data types for the property.'
              },
              description: {
                type: 'string',
                description: 'A description of the property.'
              },
              moduleConfig: {
                type: 'object',
                description: 'Configuration for the module.'
              },
              indexInverted: {
                type: 'boolean',
                description: 'Whether the property should be indexed inverted.'
              },
              indexFilterable: {
                type: 'boolean',
                description: 'Whether the property should be filterable.'
              },
              indexSearchable: {
                type: 'boolean',
                description: 'Whether the property should be searchable.'
              },
              tokenization: {
                type: 'string',
                description: 'The tokenization method for the property.'
              },
              nestedProperties: {
                type: 'array',
                items: {
                  type: 'object'
                },
                description: 'Nested properties for the property.'
              }
            },
            required: ['name', 'dataType', 'description']
          }
        },
        required: ['className', 'propertyData']
      }
    }
  }
};

export { apiTool };