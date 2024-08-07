FROM oven/bun:debian

WORKDIR /app

COPY package*.json .

RUN bun install

COPY . .

RUN ["bun", "run", "index.ts"]
