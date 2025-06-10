# Use Node.js base image
FROM node:18

# Set app working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (adjust if yours is different)
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]