# My List Service

A production-ready REST API service for managing user's movie and TV show lists.

## Features

- ✅ Add/Remove items from user's list
- ✅ Get paginated list of user's items
- ✅ Support for Movies and TV Shows
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ TypeScript support
- ✅ Unit and Integration tests
- ✅ CI/CD with GitHub Actions

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Testing**: Jest, Supertest
- **Validation**: Joi
- **Dependency Injection**: tsyringe

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd my-list-service
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.dev
# Edit .env.dev with your configuration
```

4. Run the application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## Environment Variables

Create a `.env.dev` file with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/my-list-service
```

## API Endpoints

### Health Check

- `GET /api/v1/health` - Health check endpoint

### My List

- `POST /api/v1/mylist/addToMyList` - Add item to list
- `GET /api/v1/mylist/` - Get user's list (with pagination)
- `DELETE /api/v1/mylist/` - Remove item from list

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

## Project Structure

```
src/
├── config/          # Configuration files
├── errors/          # Custom error classes
├── libs/            # Shared utilities and constants
├── middlewares/     # Express middlewares
├── modules/         # Feature modules
│   └── myList/      # MyList module
│       ├── __tests__/  # Tests
│       ├── controllers/
│       ├── services/
│       ├── validators/
│       └── ...
├── routes/          # Route definitions
└── server.ts        # Application entry point
```

## CI/CD

The project includes GitHub Actions workflow for:

- Running tests on push/PR
- Building the application
- Security audits
- Deployment (configure as needed)

## Code Quality

- TypeScript strict mode enabled
- ESLint configuration (add as needed)
- Prettier configuration (add as needed)
- Test coverage thresholds: 70%

## License

ISC
