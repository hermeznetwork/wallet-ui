FROM node:alpine AS base

RUN apk update
RUN apk upgrade
RUN apk add bash g++ make python git

WORKDIR /usr/src/wallet-ui

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start:prod"]
