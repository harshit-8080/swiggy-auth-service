# swiggy-auth-service

## packages

- npm install -D typescript ts-node @types/node nodemon
- npx tsc --init
- npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
- npm i -D eslint-config-prettier

## GIT HOOK SETUP

- npm i -D husky
- npx husky install
- npm pkg set scripts.prepare="huskt install"
- npx husky add .husky/pre-commit "npm run lint"
- npm i -D lint-staged

## App. Config Setup

## Docker Run

- docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 3000:3000 -e NODE_ENV=development auth-service:dev

## typeorm setup

- npx typeorm init --database postgres

## Docker PostgreSQL

- docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v projectpgdata:/var/lib/postgresql/data -p 5433:5432 -d postgres

## Data Validation and Sanitation using express-validator
