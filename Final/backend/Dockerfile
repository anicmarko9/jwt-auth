## stage one - build app
FROM node:18-alpine
WORKDIR /
COPY . .
RUN apk update && apk add bash
RUN npm ci
RUN npm run docker-build
RUN mkdir -p ./build/views
RUN cp ./views/* ./build/views

## stage two - run app
FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY --from=0 /build .
EXPOSE 80
CMD ["npm", "run", "docker-start"]