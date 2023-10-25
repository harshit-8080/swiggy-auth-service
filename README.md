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

## Why refresh token

- https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
- https://stackoverflow.com/questions/38986005/what-is-the-purpose-of-a-refresh-token

The code you provided seems to be using two packages: express-jwt and jwks-rsa. These packages are typically used in Node.js applications, especially in the context of securing and authenticating APIs with JSON Web Tokens (JWT).

express-jwt:

    express-jwt is a middleware for the popular Node.js web framework Express. It is used for handling JWT-based authentication and authorization in Express applications.
    In your code, you're using the expressjwt middleware exported from express-jwt.

    This middleware is designed to be used in your Express application to check and validate JWT tokens attached to incoming HTTP requests.



    Here's a breakdown of some of the key configuration options and features used in your code:

    secret:
        It specifies the secret or public key used for verifying the JWT. In your code, it's configured using JwksClient.expressJwtSecret to fetch the public keys dynamically from a JSON Web Key Set (JWKS) endpoint.

    algorithms:
        This specifies the list of algorithms that the JWT can use. In your case, it's set to RS256, which is a widely used algorithm for JWTs, especially when using asymmetric keys.

    getToken:
        This function defines how the JWT token is extracted from the incoming request. It checks the Authorization header or falls back to checking cookies to find the JWT token.

jwks-rsa:

    jwks-rsa is a package that simplifies working with JSON Web Key Sets (JWKS) in Node.js. JWKS is a standard for representing sets of cryptographic keys used in JSON Web Tokens (JWTs).


    In your code, you import JwksClient from 'jwks-rsa' to create an instance of a JWKS client.

    This client is responsible for fetching and caching public keys from a JWKS endpoint, which is necessary for verifying JWTs signed with asymmetric keys (e.g., RSA).

    The JwksClient.expressJwtSecret function is used to generate a middleware that can be used with express-jwt to dynamically fetch and verify JWT signatures against the public keys retrieved from a JWKS endpoint.

In summary, these two packages work together to provide secure JWT-based authentication in your Express application.

The express-jwt middleware checks the validity of JWTs, while the jwks-rsa package helps manage the public keys required for JWT verification.
This setup is commonly used in APIs to authenticate and authorize users based on JWT tokens.
