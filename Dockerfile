FROM node:12.11.1-alpine

ENV NODE_ENV 'production'
ENV TEAMSPEAK_USERNAME 'serveradmin'
ENV TEAMSPEAK_PASSWORD ''
ENV TEAMSPEAK_HOST 'localhost'
ENV TEAMSPEAK_SERVER_PORT '9987'
ENV TEAMSPEAK_QUERY_PORT '10011'
ENV TEAMSPEAK_PROTOCOL 'raw'
ENV TEAMSPEAK_BOT_NAME 'Bot'

RUN mkdir -p /home/node/app/node_modules

RUN mkdir -p /home/node/app/db

RUN mkdir -p /home/node/app/logs

RUN chown -Rh node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

CMD [ "npm", "start" ]

VOLUME ["/home/node/app/logs", "/home/node/app/db"]