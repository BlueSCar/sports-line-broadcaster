FROM node:10-alpine

RUN mkdir -p /home/node/sports-line-broadcaster/node_modules && chown -R node:node /home/node/sports-line-broadcaster

WORKDIR /home/node/sports-line-broadcaster

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

COPY . .
COPY --chown=node:node . .

USER node

CMD [ "pm2-runtime", "index.js" ]
