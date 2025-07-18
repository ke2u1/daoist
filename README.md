# DAO OF BENEFITS

This is a Next.js application designed to help you gamify your goals and track your progress through the lens of a cultivation fantasy world. Every task you complete earns you "Primeval Essence," helping you advance through ranks and achieve your "Grand Scheme."

## Features

*   **AI-Powered Assistance**: Use AI to generate tasks, provide weekly advice, analyze journal entries, and create rivals.
*   **Dynamic Goal Setting**: Define your ultimate goal, short-term objectives, motivations, and obstacles.
*   **Scheme Management**: Break down your goals into daily, actionable tasks ("schemes") with assigned difficulties and point values.
*   **Rival System**: Face off against AI-generated rivals who grow alongside you.
*   **Progress Tracking**: Monitor your stats, rank, achievements, and historical progress.
*   **Mind Palace**: Visualize your inner world with AI-generated art based on your goals and motivations.

## Running Locally

To run this project on your local machine, please follow these steps.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system (version 18 or higher is recommended).

### 2. Install Dependencies

Open your terminal in the project directory and run the following command to install all the necessary packages:

```bash
npm install
```

### 3. Set Up Environment Variables

This project uses Genkit and the Google AI Gemini models for its AI features. You will need a Google AI API key to run it.

1.  Create a new file named `.env` in the root of your project directory.
2.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key.
3.  Add the following line to your `.env` file, replacing `YOUR_API_KEY` with the key you just generated:

```
GOOGLE_API_KEY=YOUR_API_KEY
```

### 4. Run the Development Servers

This application requires two processes to be running simultaneously in separate terminals:

*   The Next.js web application.
*   The Genkit AI service.

**In your first terminal**, start the Next.js development server:

```bash
npm run dev
```

This will typically start the website on `http://localhost:9002`.

**In your second terminal**, start the Genkit development server:

```bash
npm run genkit:dev
```

This will start the AI service that the Next.js app communicates with.

Once both servers are running, you can open your browser to `http://localhost:9002` to view and interact with the application.
