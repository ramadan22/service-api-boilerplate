FROM node:lts-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  zip \
  unzip \
  openssl

COPY package*.json ./

RUN npm install

FROM base AS runner 

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

EXPOSE 3009

CMD [ "npm", "start"]
