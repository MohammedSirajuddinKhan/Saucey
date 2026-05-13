# Vercel Deployment Guide

## What changed in this project

- The Express app is exported from `server.js` instead of always calling `listen()`.
- Vercel enters the app through `api/index.js`.
- `vercel.json` rewrites all requests to the serverless handler.
- MongoDB connections are cached in `config/db.js` to reduce cold-start connection churn.

## Step-by-step deployment

1. Push the project to a GitHub repository.
2. Import that repository into Vercel.
3. Set the project framework to `Other` if Vercel does not auto-detect it.
4. Add these environment variables in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` is not required on Vercel, but can stay in `.env` for local use.
5. Deploy the project.
6. Open the deployed site and verify the homepage loads.
7. Test login, checkout, profile, orders, and admin pages with the seeded accounts.

## If you see `serverless function crashed`

1. Open the Vercel deployment logs.
2. Look for one of these common causes:
   - Missing `MONGODB_URI`
   - Missing `JWT_SECRET`
   - Unhandled error in a controller
   - Invalid MongoDB ObjectId in a route
   - Code calling `app.listen()` inside a serverless function
3. Confirm the app is using `api/index.js` and `vercel.json`.
4. Confirm the server is exported from `server.js` and not only started with `listen()`.
5. Confirm your database URI allows access from Vercel.
6. Redeploy after fixing the cause.

## Local verification

1. Run `npm install`.
2. Start the app locally with `npm run server`.
3. Open `http://localhost:3000`.
4. Confirm the seeded data is visible.
5. Confirm the checkout and admin flows still work.

## Notes for this project

- This app is a single Express app, so the easiest Vercel setup is a single serverless function with rewrites.
- Static assets in `public/` continue to work through Express static middleware.
- The pages under `views/` are server-rendered and do not need a separate frontend build step.
