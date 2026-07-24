FROM node:24-alpine AS builder

ARG NEXT_PUBLIC_CORE_ADDRESS
ENV NEXT_PUBLIC_CORE_ADDRESS=${NEXT_PUBLIC_CORE_ADDRESS}

COPY . /ui

WORKDIR /ui

RUN npm i -g pnpm@latest
RUN pnpm install && pnpm run build

FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /ui

RUN npm i -g pnpm@latest
COPY --from=builder /ui/package.json /ui/pnpm-lock.yaml /ui/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /ui/.next ./.next
COPY --from=builder /ui/public ./public
COPY --from=builder /ui/next.config.ts ./next.config.ts

EXPOSE 3000

CMD [ "pnpm", "start" ]
