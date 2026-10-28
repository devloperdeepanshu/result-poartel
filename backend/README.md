# Results Portal Backend

Node.js + Express + MongoDB backend for a results portal.

## Setup (Windows PowerShell)

1. Open a terminal in this folder.
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your MongoDB connection string, a random JWT secret (at least 32 characters), and a strong admin password. Never commit `.env` or share it publicly.
4. Ensure your MongoDB Atlas IP access list allows your current IP and your database user has the required permissions.
5. Create/update the admin account:

   ```powershell
   npm run seed:admin
   ```

6. Start the API:

   ```powershell
   npm run dev
   ```

7. Test `http://localhost:5000/`.

## API endpoints

### Public
- `GET /`
- `GET /api/locations`
- `GET /api/results/current` — current results and waiting status/time; **waiting numbers are never returned**
- `GET /api/results/history?month=10&year=2026` — published history for a month

### Admin (send header `Authorization: Bearer YOUR_JWT_TOKEN`)
- `POST /api/auth/login` — JSON `{ "username": "...", "password": "..." }`
- `POST /api/locations` — JSON `{ "name": "Pateabad" }`
- `DELETE /api/locations/:id`
- `GET /api/results/admin`
- `POST /api/results/admin/location/:locationId` — JSON with `currentNumber`, `waitingNumber`, and future ISO `publishAt`; current and waiting are optional but at least one must be supplied. Example:

  ```json
  {
    "currentNumber": "42",
    "waitingNumber": "18",
    "publishAt": "2026-10-29T12:30:00+05:30"
  }
  ```

  A submitted current number publishes immediately and expires after 24 hours. A waiting number is only published when its scheduled time arrives. Adding results replaces that location's prior active current/waiting results.
- `DELETE /api/results/admin/:id` — removes a waiting result or expires a published result while retaining its history.

## Notes
- The server's scheduler runs every 15 seconds while the server is online. If the server is stopped at the scheduled time, due results are processed on startup or the next API request.
- Published results remain in the database after expiry for monthly history.
- The history API returns only results that were actually published; waiting entries are excluded.
- This is the backend API only. The existing React frontend still needs to be updated to call these endpoints instead of its demo `localStorage` logic.
