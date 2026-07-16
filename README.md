
# EcoSphere ESG Platform

EcoSphere is an AI-powered ESG (Environmental, Social & Governance) management platform for tracking sustainability metrics, carbon emissions, CSR initiatives, employee engagement, and compliance through interactive dashboards and analytics.

## Overview

EcoSphere helps organizations manage ESG operations in one place. It provides a centralized system to monitor sustainability data, track employee and CSR-related activities, and support reporting with an analytics-driven interface.

## Features

* ESG performance tracking
* Carbon emissions monitoring
* CSR activity management
* Employee engagement tracking
* Compliance-focused reporting
* Interactive dashboards and analytics
* SQLite-based local data storage
* Production-ready backend setup

## Tech Stack

* Frontend: Vite, JavaScript, HTML, CSS
* Backend: Node.js
* Database: SQLite
* Deployment: Render
* Environment management: `.env`

## Project Structure

* `src/` — application source code
* `public/` — static assets
* `database.sqlite` — SQLite database file
* `render.yaml` — Render deployment configuration
* `vite.config.js` — Vite configuration
* `.env.example` — environment variable template

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update the values:

```env
JWT_SECRET=your_secret_key_here
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 3. Run in production mode

```bash
NODE_ENV=production node src/index.js
```

The app will create the SQLite database automatically and seed sample data on the first run.

## Development Mode

Run backend and frontend separately:

### Terminal 1 — Backend

```bash
node src/index.js
```

### Terminal 2 — Frontend

```bash
npm run dev
```

## Default Login

* Admin: `admin@ecosphere.com` / `admin123`
* Employee: `employee@ecosphere.com` / `emp123`

## Build

```bash
npm run build
```

## Deployment

This project is configured for deployment on Render. Make sure the environment variables are added correctly before deploying.

## About

EcoSphere is designed to simplify ESG tracking and reporting for organizations by combining sustainability data, operational monitoring, and analytics in a single platform.
