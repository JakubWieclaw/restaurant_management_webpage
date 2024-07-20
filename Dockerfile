# Stage 1: Build the application
FROM node:22.3-alpine AS build

# Set working directory
WORKDIR /app

# Copy the package.json and tsconfig.json and the rest of the files
COPY package.json .
COPY tsconfig.json .
COPY .env .
COPY . .

# Install dependencies and build the app
RUN yarn install
RUN yarn build

# Stage 2: Serve the application using a web server
FROM nginx:alpine

# Copy the build output to the nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
