# StudyHub LMS

StudyHub LMS is a modern, interactive Learning Management System built with React, TypeScript, and Vite. It provides a comprehensive platform for both teachers and students, incorporating gamification and AI-assisted learning.

## Features

- **Role-based Access**: Dedicated interfaces for Teachers, Students, and Admins.
- **Student Dashboard**: 
  - Browse learning categories, topics, and classes.
  - Watch educational videos.
  - Take quizzes after completing lessons.
- **Teacher Dashboard**: 
  - Upload and manage educational videos.
  - Track student progress.
- **Gamification**: 
  - Earn points by completing quizzes.
  - Unlock badges based on performance.
  - Compete on the Class Leaderboard.
- **AI ChatBot**: Integrated AI assistant to help students with their queries.
- **Real-time Synchronization**: Built with Firebase for real-time updates and data persistence.

## Tech Stack

- **Frontend**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Backend/Database**: Firebase
- **Deployment**: Vercel / GitHub Pages (gh-pages)

## Installation & Setup

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd studyhub-lms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   This will start the Vite development server. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles TypeScript and builds the project for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run deploy`: Deploys the application using GitHub Pages.

## Project Structure

- `/src/components`: Reusable UI components and specific views (Dashboards, Quizzes, Leaderboard).
- `/src/config`: Configuration files, including Firebase setup (or mock Firebase).
- `/src/data`: Mock data for categories, topics, and classes.
- `/src/types`: TypeScript interfaces and types used across the application.
- `/src/utils`: Utility functions, such as gamification logic (points, badges).

## Authentication & Database

The project currently uses a Firebase configuration. Depending on your setup, it may use a mocked version of Firebase for rapid UI development and testing or connect directly to a real Firebase project. Ensure your `firebase.json` and `.firebaserc` are configured properly if using a live database.

## License

This project is private and intended for educational/internal use.
