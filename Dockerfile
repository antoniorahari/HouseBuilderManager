FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build:all

CMD ["node", "--es-module-specifier-resolution=node", "server/index-render.js"]
