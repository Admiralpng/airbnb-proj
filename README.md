# Airbnb Capstone

React frontend with an Express + MongoDB backend in `backend/`.

## Running it

Two processes are required.

1. Backend:

```
cd backend
npm install
cp .env.example .env     # set MONGODB_URI and JWT_SECRET
npm run seed             # inserts the 12 base listings if the collection is empty
npm start                # http://localhost:5000
```

`npm run dev:local` starts the API against a throwaway in-memory MongoDB, which is useful when you have no Atlas access.

2. Frontend, from the project root:

```
npm install
npm start                # http://localhost:3000
```

`package.json` sets `"proxy": "http://localhost:5000"`, so `/api` and `/uploads` requests from the dev server reach the backend. If the backend is not running, listings fail to load with a message in the page instead of a build error.

## Where things live

- `backend/server.js` — app setup, CORS, JSON parsing, static `/uploads`, route mounting, Mongo connect
- `backend/models/` — `User`, `Listing`, `Booking`
- `backend/routes/` — `auth`, `listings`, `bookings`
- `backend/middleware/auth.js` — `requireAuth`, `requireListingOwner`
- `backend/seedListings.js` + `backend/seed.js` — the 12 base listings, unowned and read-only
- `src/api.js` — fetch wrapper with bearer token and a status-carrying `ApiError`
- `src/App Context/authContext.js` — `user`, `loggedIn`, `login`, `register`, `logout`, `refreshUser`
- `src/App Context/listingsContext.js` — fetch-once listings catalog, one-time legacy `localStorage` clear
- `src/components/Listings/favorites.js` — favorites stay in `localStorage`

## API

| Method | Route | Auth |
|---|---|---|
| POST | `/api/auth/register` | no, 409 if email exists |
| POST | `/api/auth/login` | no, 404 unknown email, 401 wrong password |
| GET | `/api/auth/me` | yes, 401 also signals expiry |
| GET | `/api/listings` | no |
| GET | `/api/listings/:id` | no, 404 if missing |
| POST | `/api/listings` | yes, multipart, sets `owner` |
| PATCH | `/api/listings/:id` | yes, owner only, else 403 |
| DELETE | `/api/listings/:id` | yes, owner only, deletes files, keeps bookings |
| GET | `/api/bookings` | yes, current user, newest first |
| POST | `/api/bookings` | yes, computes `nights` and `total`, 409 on date overlap |
| DELETE | `/api/bookings/:id` | yes, owner only, else 404 |

Booking totals are computed server-side as `price * nights * guests`. Bookings denormalize title, location, image, and price so they still render after their listing is deleted.

Known behavior: a booking whose listing was deleted links to a not-found listing page.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
