# Use the official Node.js image as our base
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build


FROM node:18-alpine as PRODUCTION

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./

RUN npm i --ignore-scripts

COPY --from=builder /app/build ./

EXPOSE 5500

CMD ["node","src/server.js"]

