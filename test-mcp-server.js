import http from 'http';

// Test data for tools/list request
const testData = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {}
});

const options = {
  hostname: 'localhost',
  port: 4001,
  path: '/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('Testing MCP Server at http://localhost:4001/messages');
console.log('Sending tools/list request...\n');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.result && parsed.result.tools) {
        console.log(`\n✅ Success! Found ${parsed.result.tools.length} tools`);
        console.log('\nFirst 5 tools:');
        parsed.result.tools.slice(0, 5).forEach((tool, i) => {
          console.log(`${i + 1}. ${tool.name}`);
        });
      }
    } catch (err) {
      console.log('Raw response:', data);
      console.error('Failed to parse response:', err.message);
    }
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err.message);
});

// Send the request
req.write(testData);
req.end();
