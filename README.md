# Parker Householder's Remix Template

This is my repository for creating web applications using Remix. My Remix Template acts a skeleton for creating enterprise level CRUD applications. Follow the steps below to set up an example in your local environment

## Prerequisites

To get started, please ensure your local machine has the following installed

- **Node 21 or higher** 📦
- **Docker** 🐳
- **pgAdmin 4** 🛠️

## Installation Guide

### Step 1: Clone Repository from Github

Clone this repository to your local machine

```sh
git clone https://github.com/phouseholder/nymbl
cd nymbl
```

### Step 2: Deploy Infrastructure

Start the infrastructure with docker. This will connect you with the Vercel hosted db and set up the POSTGREST API which will listen on http://localhost:8080

```sh
docker-compose up -d
```

### Step 3: Install Dependencies

Install all dependencies using npm

```sh
npm install
```

### Step 4: Start Development

Kick off your development server using npm. This will run on http://localhost:5173 and communicate with the infrastructure set up in Step 2.

```sh
npm run dev
```

### Step 5: Authenticate

Navigate to http://localhost:5173 and use the following credentials to authenticate:

- username: **admin**
- password: **password**
