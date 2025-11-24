FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port and run in development mode using nodemon (dev-friendly)
EXPOSE 4000
CMD ["npm", "run", "dev:express"]
