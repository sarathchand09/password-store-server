### STAGE 1: Build ###
FROM node:8.7.0-alpine as build

COPY package*.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /app && mv ./node_modules ./app

WORKDIR ./app

COPY . .

CMD ["npm", "start"]