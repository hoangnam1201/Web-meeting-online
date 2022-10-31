# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent --legacy-peer-deps
RUN npm install react-scripts@5.0.1 -g --silent --legacy-peer-deps

# add app
COPY . ./

# start app
CMD ["npm", "start"]