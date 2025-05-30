import dotenv from 'dotenv';
dotenv.config();

/**
 * Function to retrieve Raft cluster statistics from Weaviate.
 *
 * @returns {Promise<Object>} - The statistics of the Raft cluster.
 */
const executeFunction = async () => {
  const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';
  const token = process.env.WEAVIATE_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}/cluster/statistics`;

    // Set up headers for the request
    const headers = {
    'Accept': 'application/json',
    'Authorization': process.env.WEAVIATE_API_KEY ? `Bearer ${process.env.WEAVIATE_API_KEY}` : undefined
    };

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
    console.error('Error retrieving Raft cluster statistics:', error);
    return { error: 'An error occurred while retrieving Raft cluster statistics.' };
  }
};

/**
 * Tool configuration for retrieving Raft cluster statistics from Weaviate.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_raft_cluster_statistics',
      description: 'Retrieve Raft cluster statistics from Weaviate.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };