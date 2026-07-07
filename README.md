# UR-HEALTH: Healthcare Management System

UR-HEALTH is a comprehensive Healthcare Management System designed to streamline hospital operations, enhance patient care, and improve overall emergency response efficiency. It provides an intuitive interface for medical professionals to monitor patient metrics, manage resources, and triage emergencies in real-time.

## Features

- **Dashboard**: A centralized overview of hospital operations, including active patients, bed availability, and critical alerts.
- **Emergency Triage**: Rapid assessment and prioritization tools for incoming emergencies.
- **ICU Bed Management**: Real-time tracking of Intensive Care Unit capacity and resource allocation.
- **Alerts Center**: Immediate notifications for critical patient vitals and operational bottlenecks.
- **AI Predictions**: Advanced forecasting for patient admission rates and resource requirements.
- **Special Emergency Protocol**: Dedicated workflows for handling mass casualties or severe outbreak scenarios.
- **Patients Directory**: Complete management of patient records, medical history, and current treatment plans.
- **Resources Management**: Tracking of medical supplies, staff availability, and critical equipment.

## Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & shadcn/ui components
- **Routing**: React Router
- **State Management & Data Fetching**: React Query & React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/darshanpm33/UR-HEALTH.git
   ```
2. Navigate to the project directory:
   ```bash
   cd "UR-HEALTH"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

The application will typically be available at `http://localhost:8080/` or `http://localhost:5173/`.

## Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint to identify code issues.
- `npm run test`: Runs the Vitest test suite.

## License

This project is proprietary and intended for internal healthcare management use.
