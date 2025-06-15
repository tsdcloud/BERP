# Étape 1 : Build de l'application React
FROM node:18 AS builder
WORKDIR /App/BERP
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
RUN npm install tinyglobby vite-plugin-pwa --legacy-peer-deps
COPY . .
RUN npm run build

# Étape 2 : Serveur Node.js minimal
FROM node:18
WORKDIR /App/BERP
RUN npm install -g serve
COPY --from=builder /App/BERP/dist .
EXPOSE 3000
CMD ["serve", "-s", ".", "--listen", "tcp://0.0.0.0:3000"]
