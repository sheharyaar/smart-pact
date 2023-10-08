# frontend/Dockerfile
FROM node:18.13.0-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
