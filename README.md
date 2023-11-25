# swiggy-auth-service

## Why refresh token

- https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
- https://stackoverflow.com/questions/38986005/what-is-the-purpose-of-a-refresh-token

The code you provided seems to be using two packages:

express-jwt and jwks-rsa.

These packages are typically used in Node.js applications, especially in the context of securing and authenticating APIs with JSON Web Tokens (JWT).

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

---

# RSA_PEM_TO_JWK

The provided code is a JavaScript program that reads an RSA private key in PEM (Privacy Enhanced Mail) format from a file,

converts it to a JSON Web Key (JWK) format, and specifies that the JWK should be used for signing (with the "use" parameter set to 'sig').

Let's break down the code step by step:

Importing Dependencies:

The code imports the 'fs' (file system) module, which is a built-in Node.js module for interacting with the file system.

It also imports the 'rsa-pem-to-jwk' module, which is presumably a third-party library for converting RSA keys in PEM format to JWK format.

Reading the Private Key:

The code uses the 'fs' module to read the contents of a file named 'private.pem' located in the './certs/' directory.

This file is assumed to contain the RSA private key in PEM format.
The contents of the private key file are stored in the 'privateKey' variable.

Converting the RSA Private Key to JWK:

The 'rsaPemToJwk' function is called with two main arguments:

The first argument is the RSA private key in PEM format, which is stored in the 'privateKey' variable.

The second argument is an options object, which specifies that the JWK should be used for signing ('use' is set to 'sig').

Storing the JWK:

The resulting JWK is stored in the 'jwk' variable after the conversion is complete.

---

Now, let's discuss why it's important to convert an RSA PEM key to a JWK:

JSON Web Keys (JWKs) are a standard way of representing cryptographic keys, including public and private keys, in a JSON format.

Converting an RSA PEM key to a JWK has several advantages:

Interoperability:
JWK is a standard format that can be used across different programming languages and platforms.
This makes it easier to exchange keys between systems that may not use the same key representation.

Security:
JWKs can be used with modern web technologies and standards like JSON Web Tokens (JWTs) and OAuth 2.0.
These standards often require the use of JWKs for key management, and using JWKs can help ensure proper security practices are followed.

Ease of Use:
JWKs are represented as JSON objects, which are easier to work with in modern web applications that often rely on JSON for data interchange.
This simplifies key handling and integration into various software components.

Algorithm and Use Specification:
JWKs allow you to specify the intended use of the key, such as 'sig' (signing) or 'enc' (encryption), and also specify the cryptographic algorithm in use.
This information can be crucial for security and compatibility when using the key for specific purposes.

In the provided code, the conversion to JWK with the 'use' parameter set to 'sig' indicates that the key is intended for signing purposes, which is a common requirement in applications like authentication and data integrity verification.

## TypeORM

TypeORM is an Object-Relational Mapping (ORM) library for TypeScript and JavaScript that simplifies working with relational databases. It allows developers to interact with databases using object-oriented programming techniques rather than writing raw SQL queries. Here's a detailed explanation of TypeORM and how it can help in developing applications:

Object-Relational Mapping (ORM):
ORM libraries like TypeORM bridge the gap between object-oriented programming languages (like TypeScript/JavaScript) and relational databases (such as PostgreSQL, MySQL, SQLite, etc.). They provide a way to map database tables to classes and their relationships to object-oriented structures, making database interactions more intuitive and less reliant on raw SQL.

Key Features and Benefits of TypeORM:
Entity-Relationship Mapping:

TypeORM maps database tables to TypeScript/JavaScript classes (entities) and their properties. Each instance of an entity represents a row in the database table.
Support for Multiple Databases:

It supports various databases, including PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, and more, allowing developers to work with the database of their choice without changing the code significantly.
Simplified Querying:

TypeORM provides an API to perform CRUD operations (Create, Read, Update, Delete) on entities without writing complex SQL queries explicitly. For example:
typescript
Copy code
const newUser = new User();
newUser.name = "John Doe";
await userRepository.save(newUser);
Data Validation and Type Safety:

It helps enforce data validation rules through decorators and TypeScript types, ensuring type safety and reducing errors in data handling.
Migrations:

TypeORM supports database schema migrations, allowing developers to manage database schema changes and version control easily.
Relationship Handling:

It supports defining relationships between entities, such as one-to-one, one-to-many, many-to-one, and many-to-many, simplifying complex data retrieval and manipulation.
Transactions:

It enables the use of transactions to ensure atomicity and data consistency across multiple operations.
How TypeORM Helps:
Productivity: TypeORM abstracts away much of the complexity of database interaction, allowing developers to focus more on application logic rather than SQL intricacies.

Code Maintainability: By using TypeScript and object-oriented principles, TypeORM promotes cleaner, more maintainable code by leveraging features like classes, inheritance, and interfaces.

Database Flexibility: Developers can switch between different database systems with minimal code changes, thanks to TypeORM's database-agnostic approach.

Reduced Development Time: With its intuitive querying and data handling methods, TypeORM can significantly reduce the time spent on database-related tasks during development.

TypeORM is particularly useful in projects where TypeScript or JavaScript is the primary language and where maintaining a clear and consistent database structure is essential. It streamlines database interactions, providing a robust and scalable solution for modern web applications.

## Added Github actions
