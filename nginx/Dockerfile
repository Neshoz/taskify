# Build
FROM node:18-alpine as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY ./packages/shared-service-types/package.json ./packages/shared-service-types/
COPY ./packages/webapp/package.json ./packages/webapp/
RUN yarn install

COPY ./packages/shared-service-types ./packages/shared-service-types/
COPY ./packages/webapp ./packages/webapp

RUN yarn workspace @taskify/shared-service-types build
RUN yarn workspace @taskify/webapp build

# Run
FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/packages/webapp/dist /usr/share/nginx/html/webapp
EXPOSE 80
CMD ["nginx", "-g","daemon off;"]