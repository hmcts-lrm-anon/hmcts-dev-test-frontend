# HMCTS Task Management Frontend

A simple web interface for managing tasks, built with Express.js and the GOV.UK Design System. Provides a user-friendly interface for creating, viewing, editing, and deleting tasks.

## Tech Stack

- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Nunjucks** - Server-side templating
- **GOV.UK Frontend** - Government design system
- **Axios** - HTTP client for API communication
- **Webpack** - Asset bundling
- **Jest** - Testing framework
- **Supertest** - HTTP integration testing
- **Chai** - Assertion library

## Quick Start

### Prerequisites
- Node.js 18+ with yarn
- Backend API running on port 4000

### Running the Application

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build assets:
   ```bash
   yarn webpack
   ```

3. Start the development server:
   ```bash
   yarn start:dev
   ```

The application will be available at **http://localhost:3100**

## Features

- **Create tasks** with title, description, status, and due date
- **View all tasks** in a clean, accessible interface
- **Edit existing tasks** with form validation
- **Delete tasks** with confirmation
- **GOV.UK Design System** for consistent styling

## API Integration

The frontend communicates with the backend REST API on port 4000:
- **GET /tasks** - Retrieve all tasks
- **POST /tasks** - Create new task
- **PUT /tasks/:id** - Update existing task
- **DELETE /tasks/:id** - Delete task

## Testing

Run tests with:
```bash
yarn test
```

The project includes:
- **Jest** testing framework with **Supertest** 
- **Integration tests** for the create task route
- **Minimal test coverage** - foundation for future testing

## Future Improvements
- 
- Add comprehensive testing
- Implement user authentication
- Accessibility considerations 
- Add UI and routing for search and filtering capabilities 
- Improved documentation
- Implement security
