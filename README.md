# ChatEnhance

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Excellent-brightgreen.svg)](https://github.com/rblake2320/chatenhance)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](https://github.com/rblake2320/chatenhance)

ChatEnhance is an advanced conversational AI platform that provides enhanced chat capabilities with modern web technologies. Built with React, TypeScript, and comprehensive testing infrastructure for reliable, scalable chat experiences.

## 🚀 Key Features

### Core Capabilities

- **Modern React Frontend**: Built with React 18, TypeScript, and Vite for fast development
- **Real-time Chat**: WebSocket-based real-time messaging capabilities
- **AI Integration**: Enhanced chat experiences with AI-powered features
- **Responsive Design**: Mobile-first design with modern UI components
- **Database Integration**: Drizzle ORM with PostgreSQL for data persistence
- **Authentication**: Secure user authentication and session management

### Development Features

- **TypeScript Support**: Full TypeScript integration for type safety
- **Comprehensive Testing**: Jest testing framework with 70% coverage requirements
- **Code Quality**: ESLint, Prettier, and automated code formatting
- **Hot Reload**: Fast development with Vite's hot module replacement
- **Database Migrations**: Automated database schema management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **Build Tools**: Vite, esbuild

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm 8+
- PostgreSQL database

### Setup

```bash
# Clone the repository
git clone https://github.com/rblake2320/chatenhance.git
cd chatenhance

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript checks

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Quality Assurance
npm run quality         # Run all quality checks
npm run pre-commit      # Pre-commit checks
npm run validate        # Full validation pipeline
```

### Code Quality Standards

This project maintains high code quality standards:

- **70% test coverage** minimum requirement
- **ESLint** for code linting with TypeScript and React rules
- **Prettier** for consistent code formatting
- **TypeScript** for type safety
- **Husky** for git hooks and pre-commit checks

### Testing

The project uses Jest with React Testing Library for comprehensive testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files should be placed alongside source files with `.test.ts` or `.test.tsx` extensions.

## 🏗️ Project Structure

```
chatenhance/
├── client/src/          # Frontend React application
├── server/              # Backend Node.js server
├── shared/              # Shared utilities and types
├── src/                 # Additional source files
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── coverage/            # Test coverage reports
├── dist/                # Built application
└── docs/                # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/chatenhance

# Server
PORT=3000
NODE_ENV=development

# Authentication (if applicable)
JWT_SECRET=your-jwt-secret
```

### Database Setup

The project uses Drizzle ORM for database management:

```bash
# Push schema changes to database
npm run db:push

# Generate migrations (if needed)
npm run db:generate
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Support

If Docker configuration is available:

```bash
# Build Docker image
docker build -t chatenhance .

# Run container
docker run -p 3000:3000 chatenhance
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`npm run quality`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Ensure all quality checks pass
- Update documentation as needed
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Repository](https://github.com/rblake2320/chatenhance)
- [Issues](https://github.com/rblake2320/chatenhance/issues)
- [Pull Requests](https://github.com/rblake2320/chatenhance/pulls)

## 📞 Support

If you have any questions or need help, please:

1. Check the existing [issues](https://github.com/rblake2320/chatenhance/issues)
2. Create a new issue if your question isn't already addressed
3. Provide detailed information about your problem or question

---

**ChatEnhance** - Enhancing conversations with modern technology 🚀
