import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to create a new data object collection in Weaviate.
 *
 * @param {Object} args - Arguments for creating the collection.
 * @param {string} args.class - The name of the class to be created.
 * @param {Object} args.vectorConfig - Configuration for the vector.
 * @param {string} args.vectorConfig.vector_name.vectorizer - The vectorizer to use.
 * @param {string} args.vectorConfig.vector_name.vectorIndexType - The type of vector index.
 * @param {Object} args.vectorConfig.vector_name.vectorIndexConfig - Additional vector index configuration.
 * @param {Object} args.shardingConfig - Configuration for sharding.
 * @param {number} args.shardingConfig.desiredCount - Desired count for sharding.
 * @param {number} args.shardingConfig.virtualPerPhysical - Virtual per physical count.
 * @param {Object} args.replicationConfig - Configuration for replication.
 * @param {number} args.replicationConfig.factor - Replication factor.
 * @param {Object} args.invertedIndexConfig - Configuration for inverted index.
 * @param {number} args.invertedIndexConfig.cleanupIntervalSeconds - Cleanup interval in seconds.
 * @param {Object} args.bm25 - BM25 configuration.
 * @param {number} args.bm25.k1 - BM25 k1 parameter.
 * @param {number} args.bm25.b - BM25 b parameter.
 * @param {Object} args.stopwords - Stopwords configuration.
 * @param {string} args.stopwords.preset - Preset for stopwords.
 * @param {boolean} args.multiTenancyConfig.enabled - Whether multi-tenancy is enabled.
 * @param {boolean} args.multiTenancyConfig.autoTenantCreation - Whether auto-tenant creation is enabled.
 * @param {string} args.description - Description of the class.
 * @param {Array} args.properties - Properties of the class.
 * @returns {Promise<Object>} - The result of the collection creation.
 */
const executeFunction = async (args) => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const className = args.class;
  const vectorConfig = args.vectorConfig;
  const shardingConfig = args.shardingConfig;
  const replicationConfig = args.replicationConfig;
  const invertedIndexConfig = args.invertedIndexConfig;
  const description = args.description;
  const properties = args.properties;
  
  const payload = {
    class: className,
    vectorConfig: vectorConfig,
    shardingConfig: shardingConfig,
    replicationConfig: replicationConfig,
    invertedIndexConfig: invertedIndexConfig,
    description: description,
    properties: properties
  };

  try {
    const response = await fetch(`${baseUrl}/schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      ,
        'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating collection:', error);
    return { error: 'An error occurred while creating the collection.' };
  }
};

/**
 * Tool configuration for creating a collection in Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_collection',
      description: 'Create a new data object collection in Weaviate.',
      parameters: {
        type: 'object',
        properties: {
          class: {
            type: 'string',
            description: 'The name of the class to be created.'
          },
          vectorConfig: {
            type: 'object',
            description: 'Configuration for the vector.',
            properties: {
              vector_name: {
                type: 'object',
                properties: {
                  vectorizer: {
                    type: 'string',
                    description: 'The vectorizer to use.'
                  },
                  vectorIndexType: {
                    type: 'string',
                    description: 'The type of vector index.'
                  },
                  vectorIndexConfig: {
                    type: 'object',
                    description: 'Additional vector index configuration.'
                  }
                }
              }
            }
          },
          shardingConfig: {
            type: 'object',
            description: 'Configuration for sharding.',
            properties: {
              desiredCount: {
                type: 'integer',
                description: 'Desired count for sharding.'
              },
              virtualPerPhysical: {
                type: 'integer',
                description: 'Virtual per physical count.'
              }
            }
          },
          replicationConfig: {
            type: 'object',
            description: 'Configuration for replication.',
            properties: {
              factor: {
                type: 'integer',
                description: 'Replication factor.'
              }
            }
          },
          invertedIndexConfig: {
            type: 'object',
            description: 'Configuration for inverted index.',
            properties: {
              cleanupIntervalSeconds: {
                type: 'integer',
                description: 'Cleanup interval in seconds.'
              },
              bm25: {
                type: 'object',
                properties: {
                  k1: {
                    type: 'number',
                    description: 'BM25 k1 parameter.'
                  },
                  b: {
                    type: 'number',
                    description: 'BM25 b parameter.'
                  }
                }
              },
              stopwords: {
                type: 'object',
                properties: {
                  preset: {
                    type: 'string',
                    description: 'Preset for stopwords.'
                  }
                }
              }
            }
          },
          description: {
            type: 'string',
            description: 'Description of the class.'
          },
          properties: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the property.'
                },
                dataType: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Data types of the property.'
                },
                description: {
                  type: 'string',
                  description: 'Description of the property.'
                }
              }
            }
          }
        },
        required: ['class', 'vectorConfig', 'shardingConfig', 'replicationConfig', 'invertedIndexConfig', 'description', 'properties']
      }
    }
  }
};

export { apiTool };