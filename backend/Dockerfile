## Прва фаза - изградња слике
FROM node:18-alpine
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run docker-build
RUN mkdir -p ./build/views
RUN cp ./views/* ./build/views

## Друга фаза - покретање слике
FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY --from=0 /build .
EXPOSE 5010
CMD ["npm", "run", "docker-start"]