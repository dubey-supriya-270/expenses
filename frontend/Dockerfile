# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# 1️⃣ Install deps (kept separate for cache)
COPY package*.json vite.config.* tsconfig.* ./
RUN npm ci --ignore-scripts

# 2️⃣ Copy project files
COPY src ./src
COPY public ./public
COPY index.html ./ 

# optional: tailwind, env.d.ts, etc.
# COPY tailwind.config.* ./

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
