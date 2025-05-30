import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all tool files
const toolsDir = path.join(__dirname, 'tools', 'weaviate', 'weaviate');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.js'));

console.log(`Found ${files.length} tool files to update...`);

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 1. Replace hardcoded localhost URL with environment variable
  if (content.includes("const baseUrl = 'http://localhost:8080/v1';")) {
    content = content.replace(
      "const baseUrl = 'http://localhost:8080/v1';",
      "const baseUrl = process.env.WEAVIATE_URL ? `${process.env.WEAVIATE_URL}/v1` : 'http://localhost:8080/v1';"
    );
    modified = true;
  }
  
  // 2. Add API key from environment if headers object exists
  if (content.includes('const headers = {')) {
    // Check if Authorization header is missing
    if (!content.includes('Authorization')) {
      // Find the headers object and add Authorization
      content = content.replace(
        /const headers = {([^}]+)}/g,
        (match, headerContent) => {
          // Add Authorization header
          const updatedHeaders = `const headers = {${headerContent},
      'Authorization': process.env.WEAVIATE_API_KEY ? \`Bearer \${process.env.WEAVIATE_API_KEY}\` : undefined
    }`;
          return updatedHeaders;
        }
      );
      modified = true;
    }
  } else if (content.includes('headers:')) {
    // For inline headers in fetch calls
    content = content.replace(
      /headers: {([^}]+)}/g,
      (match, headerContent) => {
        if (!headerContent.includes('Authorization')) {
          return `headers: {${headerContent},
        'Authorization': process.env.WEAVIATE_API_KEY ? \`Bearer \${process.env.WEAVIATE_API_KEY}\` : undefined
      }`;
        }
        return match;
      }
    );
    modified = true;
  }
  
  // 3. Add import for dotenv at the top if not present
  if (modified && !content.includes('dotenv')) {
    content = `import dotenv from 'dotenv';\ndotenv.config();\n\n${content}`;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`⏭️  Skipped: ${file} (no changes needed)`);
  }
});

console.log('\n✅ All tools updated successfully!');