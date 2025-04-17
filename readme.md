# Pocket Budget Backend

This is the backend application intended to act as a REST API for the pocket budget app.

## Setup

1. You'll need to start postgres in an environment, such as Docker, and then add the following environment variables:
   - DATABASE_URI ("localhost" if hosting in Docker)
   - DATABASE_NAME
   - DATABASE_USER
   - DATABASE_PASSWORD
   - DATABASE_PORT
2. Optionally, add the following environment variables:
   - PORT (Default is 5000)
   - DEVELOPMENT_EMAIL = (will predicate all seeded emails)
3. Run the script `migrate` and then `seed`, which will create tables in your database, and then seed data in them.
4. Start with script `start` or `dev`

TODO: Add documentation for obtaining google oauth credentials
