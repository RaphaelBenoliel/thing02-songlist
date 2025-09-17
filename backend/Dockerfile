# builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# COPY source files
COPY . .

# build the project
RUN npm run build

# runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
