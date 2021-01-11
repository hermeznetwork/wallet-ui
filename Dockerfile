FROM node:alpine AS base

RUN apk update
RUN apk upgrade
RUN apk add bash g++ make python git

ARG GIT_VERSION=0
LABEL vcs-ref=$GIT_VERSION

ARG ETHEREUM_PROVIDER
ARG HERMEZ_API_URL
ARG BATCH_EXPLORER_URL

ENV REACT_APP_ETHEREUM_PROVIDER ${ETHEREUM_PROVIDER}
ENV REACT_APP_HERMEZ_API_URL ${HERMEZ_API_URL}
ENV REACT_APP_BATCH_EXPLORER_URL ${BATCH_EXPLORER_URL}

WORKDIR /usr/src/wallet-ui

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start:prod"]
