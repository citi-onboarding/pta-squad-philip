FROM node:22-slim

ENV CI=true

RUN apt-get update -y && apt-get install -y openssl
RUN npm i -g pnpm

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json pnpm-lock.yaml ./

USER node

RUN pnpm install --ignore-scripts
RUN pnpm approve-builds --yes

COPY --chown=node:node . .

RUN pnpm generate

EXPOSE 3001

CMD [ "sh", "-c", "pnpm migration:deploy && pnpm dev" ]