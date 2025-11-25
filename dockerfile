# Etapa 1: build do Strapi (admin + código)
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10 && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Etapa 2: imagem final de produção
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=1337
EXPOSE 1337

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10 && pnpm install --prod --frozen-lockfile

COPY . .
COPY --from=build /app/dist ./dist

CMD ["pnpm", "start"]