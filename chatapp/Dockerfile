FROM node:20

WORKDIR /usr/src/chatapp

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsx

EXPOSE 3000

CMD ["npm", "start"]