##FROM ubuntu:latest
#FROM node:20.10
#LABEL authors="yvansiaka"
#
#FROM node:20.10
#
#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
#
#WORKDIR /home/node/app
#
#COPY package*.json ./
#
#USER node
#
#RUN npm install
#
#COPY --chown=node:node . .
#
#EXPOSE 8080
#
#CMD [ "node", "app.js" ]
#
#ENTRYPOINT ["top", "-b"]

##########################################################################################

# Stage 1: Build the React Application

# Use an official Node runtime as a parent image
FROM node:20-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .


# Build the React app
RUN npm run build

# Stage 2: Setup the Nginx Server to serve the React Application

# Use an official Nginx runtime as a parent image
FROM nginx:1.21.0-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx-conf/anginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

