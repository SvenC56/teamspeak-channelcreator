# build static files
FROM node:alpine as build
ENV FRONTEND_DIR ./frontend
WORKDIR /usr/src/app
COPY ${FRONTEND_DIR} ${FRONTEND_DIR}
RUN npm --prefix ${FRONTEND_DIR} --silet install ${FRONTEND_DIR}
RUN npm run build --prefix ${FRONTEND_DIR}

# final image
FROM node:alpine
ENV PORT 8080
ENV BACKEND_DIR ./backend
ENV FRONTEND_DIR ./frontend
ENV BASE_URL ''
ENV TEAMSPEAK_USERNAME 'serveradmin'
ENV TEAMSPEAK_PASSWORD ''
ENV TEAMSPEAK_HOST 'localhost'
ENV TEAMSPEAK_SERVER_PORT '9987'
ENV TEAMSPEAK_QUERY_PORT '10011'
ENV TEAMSPEAK_PROTOCOL 'raw'
ENV TEAMSPEAK_BOT_NAME 'Bot'
EXPOSE ${PORT}
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
RUN mkdir -p ${BACKEND_DIR}/db
RUN mkdir -p ${BACKEND_DIR}/logs
COPY --chown=node:node ${BACKEND_DIR} ${BACKEND_DIR}
RUN npm --prefix ${BACKEND_DIR} --silet install ${BACKEND_DIR}
RUN npm run build --prefix ${BACKEND_DIR}
# Remove Dev dependencies
RUN cd ${BACKEND_DIR} && npm prune --production && cd ../
# Copy Frontend Build
COPY --chown=node:node --from=build /usr/src/app/frontend/dist ${FRONTEND_DIR}/dist
CMD ["npm", "run", "server:prod", "--prefix", "${BACKEND_DIR}"]
VOLUME ["/home/node/app/backend/logs", "/home/node/app/backend/db"]
HEALTHCHECK --interval=10s --timeout=2s --start-period=15s \  
    CMD node ${BACKEND_DIR}/healthcheck.js