# Clean Architecture Boilerplate

## Overview

This project serves as a boilerplate for building scalable and maintainable applications using Clean Architecture principles. It provides a solid foundation for developing complex systems with a clear separation of concerns, making it easier to adapt to changing requirements and technologies.

## Motivation

The primary motivation behind this boilerplate is to offer developers a starting point that adheres to Clean Architecture principles. By using this structure, teams can:

- Achieve better separation of concerns
- Improve testability of the codebase
- Enhance maintainability and scalability
- Facilitate easier adaptation to changing requirements or external services

This boilerplate aims to save time in setting up a project structure and allows developers to focus on implementing business logic rather than architectural decisions.

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Testing**: Jest
- **API Documentation**: Swagger
- **Dependency Injection**: TypeDI
- **Logging**: Winston
- **Environment Management**: dotenv

## Key Features

- Strict adherence to Clean Architecture principles
- Modular structure for easy scalability
- Dependency injection for better testability and loose coupling
- Comprehensive error handling and logging
- API documentation using Swagger
- Database migrations and seeding
- Environment-based configuration
- Linting and code formatting with ESLint and Prettier
- Pre-commit hooks with Husky

## Project Structure

The project follows a typical Clean Architecture structure:

```
src/
├── application/    # Application business rules
├── domain/         # Enterprise business rules
├── infrastructure/ # Frameworks and drivers
├── interfaces/     # Interface adapters
└── main/           # Composition root and entry point
```

## Implementation Details

### Dependency Injection

We use TypeDI for dependency injection, which allows for better testability and loose coupling between components.

### Error Handling

A centralized error handling mechanism is implemented to catch and process errors consistently across the application.

### Database Access

TypeORM is used for database operations, providing an abstraction layer that aligns well with Clean Architecture principles.

### API Layer

Express.js is used for the API layer, with routes defined in the interfaces layer and connected to the appropriate use cases.

### Validation

Input validation is performed using a combination of TypeScript's type system and a validation library (e.g., class-validator) to ensure data integrity.

## Local Development Setup

To set up the project for local development:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/clean-architecture-boilerplate.git
   cd clean-architecture-boilerplate
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the necessary environment variables

4. Set up the database:
   - Ensure PostgreSQL is installed and running
   - Create a database for the project
   - Run migrations: `npm run migrate`

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the API documentation:
   Open `http://localhost:3000/api-docs` in your browser

## Testing

Run the test suite using:

```
npm test
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.