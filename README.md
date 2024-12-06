
# Mail Assistant AI

An email assistant powered by AI to help you do more. Using Nextjs, Prisma, Postgres, Orama,

![image info](./pictures/frontpage.png)

> NB: To test out the deployed project, please use one of the following pre-existent accounts to test the AI functionalities using client data:

```text
michael.brown@company.com
^+"74;(j{RH('d5{W}u)

emma.wilson@company.com
^+"74;(j{RH('d5{W}u)

john.smith@company.com
^+"74;(j{RH('d5{W}u)
```

# Contents

- [Features](#features)
- [Technologies used](#technologies-used)
- [Application Architecture](#application-architecture)
- [Project setup](#project-setup)
  - [Clerk](#clerk)
  - [Gmail API](#gmail-api)
  - [Aurinko](#aurinko)
  - [Google Gemini](#google-gemini)
  - [Example of Environment variable file](#example-of-environment-variable-file)
  - [Installation](#installation)
    - [Option 1: NPM](#option-1-node)
    - [Option 2: Docker](#option-2-docker)

# Features

- 📧 Read, send, and reply to emails
- 🔄 Sync with multiple Gmail accounts to access all your latest emails
- 📓 Manage email templates for quick replies and fast messages
- 📈 Access various analytics on your emails and customer data
- 🦾 Have access to a variety of AI tools, from autocomplete to improve handwriting to writing custom messages, all while using your emails and data to provide contextual responses
- 🤖 Fully knowledge-based chatbot you can ask about anything from the contents of your mailbox to information about a specific client of yours, and more

# Technologies used
  
- [Next.js](https://nextjs.org) Frontend framework using Typescript, fully optimized rendering and routing using dynamic imports and prefetching. Ensuring good code quality and type safety using ESLint
- [Clerk](https://clerk.com/) Authentication manager, provides out-of-the-box security permissions, session management and auth guard
- [Prisma](https://prisma.io) ORM database to interface with the Postgres database, ensuring type-safe data management and mitigating potential threats such as SQL injections.
- [Tailwind CSS](https://tailwindcss.com) CSS styling, it's nice.
- [Shadcn/ui](https://ui.shadcn.com) Beautifully designed components for most uses out of the box and highly customizable.
- [tRPC](https://trpc.io) End-to-end type-safe APIs for efficient and fully type-safe interfacing with the server.
- [Aurinko](https://www.aurinko.io) Gmail API integration, ensures synchronization with email, sending and replying to emails
- [Orama](https://orama.com) Knowledge database to search through emails and feed it to the AI models via vectors.
- [Gemini](https://gemini.google.com) Google AI model, provides state-of-the-art generative AI models and tools optimal for the project
- [Vercel AI SDK](https://sdk.vercel.ai) Library that provides the tools needed to build with the Gemini model using RAG, data chunking, and embedding to provide the AI model with context regarding the specific queries.
- [Jotai](https://jotai.org/) Primitive and flexible state management library
- [Playwright](https://playwright.dev) End-to-end testing for web applications using various rendering engines including Chromium, WebKit, and Firefox. Used to test most user flows, mail checking, analytics viewing, template management

# Application Architecture

The application architecture works as show in the picture below:

![image info](./pictures/architecture.png)

- The app uses **Nextjs** as its framework with **Typescript**, it delegates all processes related to mail management to the **Aurinko** API, which acts as the middleware between the app and the mail provider, which in this scenario is **Gmail**.
- The app interacts with the **Postgres** database using **Prisma** to facilitate the data transfer between the two sides.
- The application uses **Orama** as a search engine to search through the emails.
- The app uses the **vercel/ai SDK** to use the **Gemini** LLM model by integrating the data from the database into the prompt through RAG, at the same time Orama searches the relevant emails and feeds them into the prompt through data chunking and embedding.

# Project setup

Before working with the project, we need to set up the needed API keys.

## Clerk

To set up authentication, we need to set up an api key from Clerk.

### 1: Sign In to Clerk Dashboard

1. Go to the [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Sign in with your Clerk account

### 2: Navigate to API Keys

1. In the Clerk Dashboard, navigate to the **API Keys** section
2. Click on **API Keys** in the sidebar

### 3: Create a New API Key

1. Click on the **Create API Key** button
2. Enter a name for your API key to help you identify it later

### 4: Copy Your API Key

1. Once the API key is created, you will see it listed in the API Keys section
2. Copy the **Publishable Key** and **Secret Key**
3. Put the publishable key to ``NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`` and secret key to ``CLERK_SECRET_KEY``

### 5: Set up test users for Playwright testing

1. Go to Clerk Dashboard and click on **Users** tab
2. Click on Create user
3. Add an email and password and save
4. Copy the newly creates user's email and password and put them into `E2E_CLERK_USER_USERNAME` and `E2E_CLERK_USER_PASSWORD`

### 6: Set up webhook for user creation

We need to set up a webhook to store the user whenever we create one.

1. Navigate to the **Webhooks** section
2. Click on **Add Endpoint**.
3. Enter the URL of your server endpoint where you want to receive the webhook events. Must be a public url, eg. <https://example.com/api/clerk/webhook>
4. **Message Filtering**: Select the `user.created` event from the list of available events.
5. Click **Create** to save the webhook endpoint.

## Gmail API

The Gmail API key will serve to interface with Google accounts and grand authorization to manage the emails.

### 1: Enable Gmail API

1. Visit the [Google Cloud Console](https://console.developers.google.com/)
2. Create or select a project from the dropdown menu on top
3. In the left-hand menu, go to "APIs & Services" > "Library"
4. Search for "Gmail API" and click on it
5. Click the "Enable" button

### 2: Create API key

1. Go to "APIs & Services" > "Credentials" in the left-hand menu
2. Click on the "Create Credentials" button and select "API key"
3. Copy newly generated  it and use it in your application
4. Click the "Save" button to apply the restrictions

## Aurinko

Aurinko needs to be set up both from the Gmail side and the development side.

### 1: Create Aurinko API Key

1. Go to the [Aurinko Portal](https://docs.aurinko.io/getting-started/get-your-developer-api-keys) and sign in with your account
2. In the Aurinko Dashboard, navigate to the **API Keys** section
3. Click on the **Create API Key** button
4. Copy the **Client ID**, **API Key** and **Client Secret**

### 2: Enable OAuth 2.0 Credentials in Gmail

1. Go to the [Google Cloud Console](https://console.developers.google.com/)
2. Go to **APIs & Services** > **Credentials**
3. Click on **Create Credentials** and select **OAuth client ID**
4. Configure the consent screen if prompted
5. Choose the application type as Web application
6. Enter the required information and click **Create**
7. Copy the **Client ID** and **Client Secret**

### 3: Integrate Aurinko with Gmail API

1. In the Aurinko Dashboard, go to your application's settings
2. Switch to the **GOOGLE** tab
3. Paste the **Google OAuth Client ID** and **Client Secret** from the Google Cloud Console
4. Click **Save**

### 4: Integrate all the keys into .env

1. Go to Aurinko dashboard
2. Put the ClientID into ``AURINKO_CLIENT_ID``
3. Put the Client secret key into ``AURINKO_CLIENT_SECRET``
4. Put Signing secret key into ``AURINKO_SIGNIN_SECRET``

### 5: Add website callbacks into Aurinko

Add the website call so Aurinko can redirect back into the website

1. Go to **Settings**
2. Click on **Callbacks**
3. Add the callback urls e.g <http://localhost:3000/api/aurinko/callback>
4. Click Save

> NB: Users and accounts are very different, users are what we use to log into the app, accounts are the Google account we use for our mail management

## Google Gemini

To use the Google Gemini we have to set up the api key

### 1: Get a Gemini API Key

1. Visit the [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Sign in with your Google account
3. Navigate to the **API Keys** section
4. Click on **Create API Key**
5. Enter a name for your API key
6. Copy the generated API key

### 2: Add key to .env

1. Put the key into `GOOGLE_GENERATIVE_AI_API_KEY`

## Example of Environment variable file

By the end of the setup, your `.env` file must look like this:

```bash
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/email-assistant-ai

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Aurinko
AURINKO_CLIENT_ID=
AURINKO_CLIENT_SECRET=
AURINKO_SIGNIN_SECRET=

# Public URL

NEXT_PUBLIC_URL=

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=

# Playwright

E2E_CLERK_USER_USERNAME=
E2E_CLERK_USER_PASSWORD=
```

## Installation

1. Open terminal and clone the repository

```bash
git clone https://github.com/CinquecentY/email-assistant-ai.git
```

### Option 1: Node

2. Install the packages

```bash
npm install
```

#### For production

3. Build the app

```bash
npm run build
```

4. Start the production server

```bash
npm run start
```

#### For development

3. Start the development server

```bash
npm run dev
```

### Option 2: Docker

There is also an option to deploy the project into a Docker container using the `docker-compose.yaml` available in the root, which will set up both the production server and the Postgres database with the included data.

```yaml
name: email-assistant-ai
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
        - .:/app
        - /app/node_modules
        - /app/.next
    ports:
      - "3000:3000"
  db:
    image: cinqye100/email-assistant-ai-db
    restart: always
        # set shared memory limit when using docker-compose
    shm_size: 128mb
    volumes:
      - db:/var/lib/postgresql/data
volumes:
  db:
```

You can then build the container by using the following command:

```bash
docker-compose up
```
