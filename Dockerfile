# frontend builder
FROM node:latest as frontend
WORKDIR /home/node/app
COPY ./frontend ./frontend
RUN yarn install --cwd ./frontend --silent
RUN yarn --cwd ./frontend generate

# backend builder
FROM node:latest as backend
WORKDIR /home/node/app
COPY . .
RUN yarn install --silent
RUN yarn build

# Node.JS Runner
FROM node:alpine as runner
LABEL maintainer="SvenC56 <https://github.com/svenc56>"

ENV PORT 3000
ENV NODE_ENV production
ENV APP_NAME TeamSpeak Channelcreator
ENV DATABASE_HOST ""
ENV DATABASE_PORT ""
ENV DATABASE_NAME ""
ENV DATABASE_USER ""
ENV DATABASE_PASSWORD ""
ENV TEAMSPEAK_HOST ""
ENV TEAMSPEAK_SERVER_PORT ""
ENV TEAMSPEAK_QUERY_PORT ""
ENV TEAMSPEAK_PROTOCOL ""
ENV TEAMSPEAK_USERNAME ""
ENV TEAMSPEAK_PASSWORD ""
ENV TEAMSPEAK_BOT_NAME ""

RUN mkdir -p /home/node/app && chown node /home/node/app
USER node
WORKDIR /home/node/app
# Copy Frontend Build
COPY --chown=node:node --from=frontend /home/node/app/frontend/dist ./frontend/dist
# Copy Backend Build
COPY --chown=node:node --from=backend /home/node/app/dist ./dist
# Database for Sqlite
RUN mkdir -p ./database && chown node ./database

# Install Production Dependencies
COPY --chown=node:node package.json package.json
COPY --chown=node:node yarn.lock yarn.lock
RUN yarn install --production --silent

VOLUME ["/home/node/app/database"]
CMD ["sh", "-c", "yarn start:prod"]
EXPOSE ${PORT}