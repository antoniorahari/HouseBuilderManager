# ---- Build Stage ----
FROM node:18 AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install root deps (mainly turborepo / scripts)
RUN npm install

# Copy everything
COPY . .

# Install client deps + build
RUN cd client && npm install && npm run build

# Install server deps + build
RUN cd server && npm install && npm run build

# ---- Production Stage ----
FROM node:18 AS runner

WORKDIR /app

# Copy server built files
COPY --from=builder /app/server/dist ./server/dist

# Copy client build
COPY --from=builder /app/client/dist ./client/dist

# Copy server package.json
COPY server/package.json server/package-lock.json ./server/

# Install only server production dependencies
RUN cd server && npm install --omit=dev

EXPOSE 3000

CMD ["node", "server/dist/index-render.js"]
