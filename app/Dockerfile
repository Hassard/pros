FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install -g @ionic/cli
RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 8100

CMD ["ionic", "serve", "--external"]