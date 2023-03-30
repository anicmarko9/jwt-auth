## stage one - build app
FROM node:18-alpine
WORKDIR /
COPY . .
RUN npm ci
RUN npm run build

## stage two - run app
FROM nginx:1.22.1-alpine
ENV NODE_ENV production
COPY --from=0 /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]