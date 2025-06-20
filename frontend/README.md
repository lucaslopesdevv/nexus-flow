# Nexus Flow

A modern web application that combines task management, inventory control, financial management, and focus time tracking in one elegant interface.

## Features

- **Task Manager**: Organize and track your tasks efficiently
- **Inventory Management**: Keep track of your inventory items
- **Financial Management**: Monitor your finances and transactions
- **Focus Time**: Stay productive with Pomodoro technique
- Dark/Light theme support
- Authentication with Clerk (Google and GitHub providers)
- Data persistence with Firebase
- Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Firebase (Firestore + Authentication)
- Clerk Authentication
- React Router DOM
- Zustand (State Management)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id

   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app

## Project Structure

```
src/
├── components/     # Reusable UI components
├── lib/           # Utilities and configurations
├── pages/         # Application pages
├── store/         # State management
└── types/         # TypeScript type definitions
```

## Development

- Run development server: `pnpm dev`
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- Lint code: `pnpm lint`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
