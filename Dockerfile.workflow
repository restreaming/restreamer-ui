FROM node:24-slim

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /ui

COPY .next/ ./
RUN npm i -g pnpm@latest

EXPOSE 3000

CMD [ "pnpm", "start" ]
