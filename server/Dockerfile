FROM node:20

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install typescript

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 8000

CMD ["npx", "tsx", "app.ts"]