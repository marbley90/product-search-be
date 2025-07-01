# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the API port
EXPOSE 3001

# Run the app
CMD ["node", "dist/main"]
