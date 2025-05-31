FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV MCP_TRANSPORT=stdio

# Expose the port (still helpful for local development)
EXPOSE 3001

# Command will be provided by smithery.yaml
CMD ["npm", "start"]