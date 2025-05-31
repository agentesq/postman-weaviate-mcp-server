FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV MCP_TRANSPORT=stdio

# Expose the port (for documentation only)
EXPOSE 3001

# Command will be provided by smithery.yaml
CMD ["node", "mcpServer.js"]