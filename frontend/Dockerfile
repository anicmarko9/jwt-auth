## Прва фаза - изградња апликације
FROM node:18-alpine
WORKDIR /
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

## Друга фаза - покретање апликације
FROM nginx:1.22.1-alpine
ENV NODE_ENV production
COPY --from=0 /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]