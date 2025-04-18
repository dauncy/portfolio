FROM node:18 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn

COPY . .

RUN yarn run build

FROM node:18
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT 3000
ENV ADDRESS "0.0.0.0"
EXPOSE 3000
EXPOSE 3001
USER node

# Change this line to use the correct path
CMD [ "node", "dist/main.js" ]
