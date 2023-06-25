# Build stage
FROM node:18-alpine as build

WORKDIR /base

# Copy workspace config
COPY package.json .
COPY tsconfig.node.json .
COPY yarn.lock .

COPY ./packages/shared-service-types/package.json packages/shared-service-types/
COPY ./packages/webhook-service/package.json packages/webhook-service/
COPY ./packages/backend-common/package.json packages/backend-common/
RUN yarn install --network-timeout 1000000
COPY ./packages/shared-service-types packages/shared-service-types/
COPY ./packages/backend-common packages/backend-common/
COPY ./packages/webhook-service packages/webhook-service/
RUN yarn workspace @taskify/webhook-service build;

# Run
FROM node:18-alpine
RUN apk add --no-cache bash
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR /usr/app
COPY --chown=node:node --from=build /base .
WORKDIR /usr/app/packages/webhook-service
USER node
EXPOSE 8003

CMD if [ "${NODE_ENV}" = "production" ] ; \
      then node build/index.js ; \
      else yarn nodemon ; \
    fi