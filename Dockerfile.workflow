FROM node:24-alpine

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /ui

RUN npm i -g pnpm@latest
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD [ "pnpm", "start" ]
