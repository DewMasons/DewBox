FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Vite dev server default port
EXPOSE 5173

# Use polling on some Docker setups for reliable HMR
ENV CHOKIDAR_USEPOLLING=true
ENV PORT=5173

# Run dev server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
