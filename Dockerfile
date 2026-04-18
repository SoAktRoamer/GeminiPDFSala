# Step 1: Build the React/Vite application
FROM node:20-alpine as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Pass the API key securely during the build process
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Build the app to the /dist folder
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config for routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run requires apps to listen on port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
