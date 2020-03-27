# frontend builder
FROM node:alpine as frontend
ENV FRONTEND_DIR ./frontend
WORKDIR /home/node/app
COPY ${FRONTEND_DIR} ${FRONTEND_DIR}
RUN yarn install --cwd ${FRONTEND_DIR}
RUN yarn --cwd ${FRONTEND_DIR} build

# backend builder
FROM node:alpine as backend
ENV BACKEND_DIR ./backend
WORKDIR /home/node/app
RUN mkdir -p ${BACKEND_DIR}/db
RUN mkdir -p ${BACKEND_DIR}/logs
COPY --chown=node:node ${BACKEND_DIR} ${BACKEND_DIR}
RUN yarn install --cwd ${BACKEND_DIR}
RUN yarn --cwd ${BACKEND_DIR} build

# Node.JS Runner
FROM node:alpine as runner
LABEL maintainer="SvenC56 <https://github.com/svenc56>"
ENV BACKEND_DIR ./backend
ENV FRONTEND_DIR ./frontend
ENV PORT 8080
ENV BASE_URL ''
ENV TEAMSPEAK_USERNAME 'serveradmin'
ENV TEAMSPEAK_PASSWORD ''
ENV TEAMSPEAK_HOST 'localhost'
ENV TEAMSPEAK_SERVER_PORT '9987'
ENV TEAMSPEAK_QUERY_PORT '10011'
ENV TEAMSPEAK_PROTOCOL 'raw'
ENV TEAMSPEAK_BOT_NAME 'Bot'

RUN mkdir -p /home/node/app && chown node /home/node/app
USER node
WORKDIR /home/node/app
# Copy Frontend Build
COPY --chown=node:node --from=frontend /home/node/app/frontend/dist ${FRONTEND_DIR}/dist
# Copy Backend Build
RUN mkdir -p ${BACKEND_DIR} && chown node ${BACKEND_DIR}
RUN mkdir -p ${BACKEND_DIR}/logs && chown node ${BACKEND_DIR}/logs
RUN mkdir -p ${BACKEND_DIR}/db && chown node ${BACKEND_DIR}/db
COPY --chown=node:node --from=backend /home/node/app/backend/dist ${BACKEND_DIR}/dist
COPY --chown=node:node --from=backend /home/node/app/backend/package.json ${BACKEND_DIR}/package.json
RUN yarn install --cwd ${BACKEND_DIR} --production
CMD ["sh", "-c", "yarn --cwd $BACKEND_DIR server:prod"]
VOLUME ["/home/node/app/backend/logs", "/home/node/app/backend/db"]
HEALTHCHECK --interval=10s --timeout=2s --start-period=15s \  
    CMD node ${BACKEND_DIR}/healthcheck.js
EXPOSE ${PORT}