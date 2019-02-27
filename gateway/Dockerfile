FROM node:8.15.0-alpine

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package.json package.json
COPY tsconfig.json tsconfig.json
ADD src src
ADD proto proto

RUN npm install --production --loglevel=error
RUN npm run build

EXPOSE 4000

CMD [ "npm", "start" ]
