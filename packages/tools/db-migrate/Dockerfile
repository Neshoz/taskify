# Build
FROM node:18-alpine as build

WORKDIR /base

COPY package.json .
COPY tsconfig.node.json .
COPY yarn.lock .

COPY ./packages/tools/db-migrate/package.json packages/tools/db-migrate/
RUN yarn install --immutable

COPY ./packages/tools/db-migrate packages/tools/db-migrate/
RUN yarn workspace @taskify/db-migrate build;

# Run
FROM node:18-alpine
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR /usr/src/app
COPY --from=build /base .
WORKDIR /usr/src/app/packages/tools/db-migrate
USER node
CMD ["node", "build/index.js"]