# שלב בנייה
FROM node:20-alpine AS builder
WORKDIR /app

# התקנת תלויות
COPY package*.json ./
RUN npm install

# העתקת קוד
COPY . .

# בנייה
RUN npm run build

# שלב ריצה
FROM node:20-alpine AS runner
WORKDIR /app

# העתקת build + תלויות
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
