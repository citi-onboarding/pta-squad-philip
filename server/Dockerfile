FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl
RUN npm i -g pnpm

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --ignore-scripts
RUN pnpm approve-builds --yes

COPY . .

RUN pnpm generate

COPY --chown=node:node . .

USER node

EXPOSE 3001

CMD [ "pnpm", "dev" ]