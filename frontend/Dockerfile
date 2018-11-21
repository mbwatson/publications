# Base image
FROM node:10.12.0-alpine

# Create and set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Environment variable - API URL
ENV REACT_APP_API_URL http://localhost:8000/api/publications/

# Install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install

# start app
CMD ["npm", "start"]