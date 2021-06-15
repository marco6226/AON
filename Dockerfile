FROM node:10-alpine
WORKDIR /usr/prodepaz/backend
COPY . .
RUN npm i
CMD ["node", "index.js"]
USER node