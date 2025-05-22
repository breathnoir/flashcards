FROM node:20-alpine AS build

ARG VITE_USER_SERVICE_URL
ARG VITE_CARDS_SERVICE_URL

ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_CARDS_SERVICE_URL=$VITE_CARDS_SERVICE_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]