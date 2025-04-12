FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY package*.json ./

RUN npm install --omit=dev

RUN rm package*.json

ENV DATABASE_HOST=ilia-shamakhia-cart.cxsgm6kwmya1.eu-north-1.rds.amazonaws.com
ENV DATABASE_PORT=5432
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=Postgres158$
ENV DATABASE_NAME=iliaShamakhiaCart

EXPOSE 4000

CMD ["node", "dist/main.js"]