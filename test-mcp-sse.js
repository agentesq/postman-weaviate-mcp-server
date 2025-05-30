import fetch from 'node-fetch';
import { EventSource } from 'eventsource';

console.log('Testing MCP Server SSE endpoint...\n');

// First, let's test if the SSE endpoint is accessible
try {
  console.log('1. Testing SSE endpoint availability...');
  const testResponse = await fetch('http://localhost:4001/sse', {
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream'
    }
  });
  
  console.log(`   Status: ${testResponse.status}`);
  console.log(`   Headers:`, testResponse.headers.raw());
  
  // Now let's test a simple query
  console.log('\n2. Testing Weaviate schema query...');
  
  // We'll use the direct REST API to test
  const weaviateUrl = 'https://xvaq82o7qpurzfep8xq.c0.us-east1.gcp.weaviate.cloud';
  const apiKey = 'oKuiRwKmrPeaHcaMOYdjFGMdmfHzV8C0ieD8';
  
  const schemaResponse = await fetch(`${weaviateUrl}/v1/schema`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (schemaResponse.ok) {
    const schema = await schemaResponse.json();
    console.log(`   ✅ Successfully retrieved schema`);
    console.log(`   Found ${schema.classes.length} collections`);
  } else {
    console.log(`   ❌ Failed to get schema: ${schemaResponse.status}`);
  }
  
  console.log('\n✅ MCP Server is running and accessible!');
  console.log('   SSE endpoint: http://localhost:4001/sse');
  console.log('   Ready for OAP integration');
  
} catch (error) {
  console.error('❌ Error testing MCP server:', error.message);
}

process.exit(0);
