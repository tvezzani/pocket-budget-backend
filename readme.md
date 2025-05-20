# Pocket Budget Backend

This is the backend application intended to act as a REST API for the pocket budget app.

## Setup

1. You'll need to start postgres in an environment, such as Docker:
   - set the env var: DATABASE_PASSWORD
   - remember to set the DATABASE_PORT (Default is 5432. If left empty it doesn't actually listen for connections.)
2. Add the following environment variables as needed:
   - DATABASE_URI ("localhost" if hosting in Docker)
   - DATABASE_NAME
   - DATABASE_USER
   - DATABASE_PASSWORD
   - DATABASE_PORT
3. Optionally, add the following environment variables:
   - PORT (Default is 5000)
   - DEVELOPMENT_EMAIL = (will predicate all seeded emails)
4. Run the script `migrate` and then `seed`, which will create tables in your database, and then seed data in them.
5. Start with script `start` or `dev`

## Adding OAuth Credentials

The `googleClientSecret.json.sample` file shows the format that is expected for the client secret. Here are the steps to obtain it:

### 1. Go to Google Cloud Console

- Visit: https://console.cloud.google.com/
- Sign in with your Google account.

---

### 2. Create or select a project

- At the top, click the project dropdown.
- Create a new project or select an existing one.

---

### 3. Enable the "Google Identity" APIs

- In the sidebar, go to **APIs & Services > Library**.
- Search for **Google Identity Services or OAuth 2.0**.
- Click **Enable**

---

### 4. Configure OAuth consent screen

- In the sidebar, go to **APIs & Services > OAuth consent screen**.
- Choose External (for apps used by general users) or Internal (if just your organization).
- Fill out required info:
  - App name
  - User support email
  - Developer contact email
- Save and continue. You can skip scopes for now or add them later.

---

### 5. Create OAuth 2.0 Credentials

- Go to **APIs & Services > Credentials**.
- Click **Create Credentials > OAuth client ID**.
- Choose **Web application** as the application type.
- Fill in:
  - **Name** (e.g., `My Backend App`)
  - **Authorized redirect URIs**:
    - Example: `http://localhost:3000/oauth2callback`
    - Or: `https://yourdomain.com/oauth2callback`
- Click **Create**.

---

### 6. Get Your Client ID and Client Secret

- After creation, you will see:
  - **Client ID**
  - **Client Secret**
- Download the credentials JSON file or securely copy and store them.

---

### 7. Use These Credentials in Your Backend

- Plug the **Client ID** and **Client Secret** into your backend OAuth library (e.g., `passport-google-oauth20`, `google-auth-library`).
- Ensure the **redirect URI** used in your app matches exactly the one configured in the Google Console.
