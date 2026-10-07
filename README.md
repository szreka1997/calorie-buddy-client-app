# Calorie Buddy — Client

Calorie Buddy is a full-stack mobile calorie and nutrition tracking application developed as my **Bachelor's thesis**.

This repository contains the **React Native client application**, built with Expo. The application communicates with a Node.js/Express backend and a PostgreSQL database.

## Features

- 🔐 User authentication and account management
- 🎯 Personalized daily and long-term nutrition goals
- 🍎 Add and manage individual food items
- 🍽️ Create and manage complete meals
- 📷 Attach images to food items
- ✏️ Edit food entries created by the logged-in user
- 📊 Track daily calorie and nutrient intake
- 📈 Track body weight over time
- 📉 Visualize progress and calorie-related data
- 📱 Scan food barcodes for easier food logging
- 🤖 Automatically assign a **Nutri-Score rating** to added food items using the OpenAI API
- 💬 Display visual and textual feedback when nutritional thresholds are exceeded

## Tech Stack

### Client

- React Native
- Expo
- JavaScript
- React Navigation
- React Native Paper
- React Hook Form
- React Native Reanimated
- React Native SVG
- React Native Chart Kit

### Device & Expo APIs

- Expo Camera
- Expo Image Picker
- Expo File System
- Expo Secure Store
- Expo Status Bar

### Backend

- Node.js
- Express.js
- PostgreSQL
- Docker
- REST API

### Testing

- Jest
- Supertest-compatible API testing on the backend

## Architecture

The application consists of a mobile client, a Node.js/Express server and a PostgreSQL database.

```text
┌──────────────────────────────┐
│      React Native Client     │
│        Expo / JavaScript     │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│     Node.js / Express API    │
└──────────────┬───────────────┘
               │
               │ PostgreSQL
               ▼
┌──────────────────────────────┐
│        PostgreSQL DB         │
└──────────────────────────────┘
```

The client and server are maintained in separate repositories.

## Project Structure

```text
calorie-buddy-client-app/
├── __mocks__/       # Jest mocks
├── assets/          # Images, fonts and other static assets
├── components/      # Reusable UI components
├── constants/       # Application constants and configuration
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── navigation/      # Application navigation
├── screens/         # Application screens
├── services/        # API and external service communication
├── tests/           # Client-side tests
├── utils/           # Utility functions
├── App.js           # Application entry point
├── app.json         # Expo configuration
├── babel.config.js
├── jest.config.js
├── index.js
└── package.json
```

## Getting Started

### Prerequisites

Before starting the application, make sure the following are installed:

- Node.js
- npm
- Docker Desktop
- Git Bash
- Expo Go on an Android device

The application requires the backend server to be running before the mobile client can be used.

### 1. Start the Server

Clone the server repository and navigate to the server directory.

Open Git Bash in the `calorie-buddy-server` directory and install the dependencies:

```bash
npm install
```

Start the backend and PostgreSQL database with Docker Compose:

```bash
docker compose up --build
```

The server must be running before starting the mobile application.

### 2. Configure the Server Address

Before starting the client, configure the IP address of the backend server in:

```text
constants/urlConstants.js
```

Replace the configured server address with the IP address of the machine running the backend.

This is required when running the application on a physical Android device, as the device needs to be able to reach the backend over the local network.

### 3. Configure Environment Variables

The client repository uses environment variables for external service configuration.

Create a local `.env` file based on the provided environment variable template and add your own API key:

```text
EXPO_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

This API key is used to interact with **ImgBB** for image uploads.

### 4. Install Client Dependencies

Navigate to the client repository:

```bash
cd calorie-buddy-client-app
```

Install the dependencies:

```bash
npm install
```

### 5. Start the Expo Development Server

Run:

```bash
npm start
```

After starting Expo, a QR code will be displayed in the terminal.

Install and open **Expo Go** on an Android device and scan the QR code to launch the application.

## Available Scripts

```bash
npm start
```

Starts the Expo development server.

```bash
npm run android
```

Runs the application using the Android development environment.

```bash
npm run ios
```

Runs the application using the iOS development environment.

```bash
npm run web
```

Starts the Expo web development server.

```bash
npm run test
```

Runs the Jest test suite.

## Troubleshooting

### Metro Bundler / Package Version Issues

Expo and the Metro Bundler are regularly updated. As a result, a package version installed in the project may occasionally become incompatible with the current Expo environment.

If this happens, install the package versions recommended by the corresponding Expo documentation and the project configuration.

### Expo SDK Compatibility

The Expo SDK version used by the project must be compatible with the version supported by the installed Expo Go application.

If the application cannot be opened because of an SDK mismatch, update or install the appropriate Expo Go version, or adjust the project's Expo package versions according to the recommended compatibility information.

## Related Repository

The backend of the application is maintained separately in the `calorie-buddy-server` repository.

The server must be started before the client application.

## Bachelor's Thesis

This application was developed as my **Bachelor's thesis** and demonstrates the design and implementation of a full-stack mobile application for calorie and nutrition tracking.

The project covers mobile application development, REST API integration, relational database management, containerization, authentication, data visualization and AI API integration.

## License

This project is licensed under the MIT License.
