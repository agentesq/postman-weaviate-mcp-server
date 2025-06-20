FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .


# Command will be provided by smithery.yaml
CMD ["node", "mcpServer.js"]