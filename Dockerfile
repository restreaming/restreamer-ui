FROM node:24-slim AS builder

COPY . /ui

WORKDIR /ui

RUN npm i -g pnpm@latest
RUN pnpm install && pnpm run build

FROM node:24-slim AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /ui

COPY --from=builder /ui ./ui
RUN npm i -g pnpm@latest

EXPOSE 3000

CMD [ "pnpm", "start" ]
