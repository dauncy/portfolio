FROM node:16 AS builder

RUN --mount=type=secret,id=DATABASE_URL \
  DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \ 
ENV DATABASE_URL=DATABASE_URL

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN yarn

COPY . .

RUN yarn run build
RUN yarn run prisma:deploy

FROM node:16
WORKDIR /app
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

ENV NODE_ENV=production
COPY --chown=node:node . .
ENV PORT 3000
ENV ADDRESS "0.0.0.0"
EXPOSE 3000
EXPOSE 3001
USER node
CMD [ "yarn", "run", "start:prod" ]
