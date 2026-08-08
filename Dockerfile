FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
# Pass build-time environment variables if needed
ARG NEXT_PUBLIC_API_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG FACEBOOK_CLIENT_ID
ARG FACEBOOK_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV AUTH_TRUST_HOST=true

# Copy public directory if exists, otherwise create empty public directory
RUN if [ -d "/app/public" ]; then echo "public directory exists"; else mkdir -p /app/public; fi

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
