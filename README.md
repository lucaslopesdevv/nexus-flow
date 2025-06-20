# NexusFlow

NexusFlow is a modern task and inventory management system built with React, Node.js, and PostgreSQL.

## Features

- 📋 Task Management
- 📦 Inventory Management
- 💰 Financial Management
- ⏱️ Focus Time Tracking
- 🌙 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Zustand
- React Router
- Vitest
- Testing Library

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Jest

## Getting Started

### Prerequisites
- Node.js 20 or higher
- Docker and Docker Compose
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexus-flow.git
cd nexus-flow
```

2. Copy environment files:
```bash
cp frontend/.env.example frontend/.env
cp api/.env.example api/.env
```

3. Start the development environment:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3000

### Development

To run the applications locally without Docker:

#### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

#### API
```bash
cd api
pnpm install
pnpm prisma generate
pnpm dev
```

### Testing

#### Frontend
```bash
cd frontend
pnpm test        # Run tests in watch mode
pnpm test:ui     # Run tests with UI
pnpm test:coverage # Run tests with coverage
```

#### API
```bash
cd api
pnpm test
pnpm test:coverage
```

## Project Structure

```
nexus-flow/
├── api/                 # Backend API
│   ├── prisma/         # Database schema and migrations
│   └── src/            # Source code
│       ├── config/     # Configuration files
│       ├── controllers/# Route controllers
│       ├── middleware/ # Express middleware
│       ├── routes/     # API routes
│       ├── services/   # Business logic
│       └── utils/      # Utility functions
│
└── frontend/           # Frontend application
    └── src/
        ├── components/ # React components
        ├── lib/        # Utility functions
        ├── pages/      # Page components
        ├── store/      # State management
        └── test/       # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 