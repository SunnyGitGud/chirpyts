# 🐦 Chirpy — A Twitter-like backend

Chirpy is a small-scale Twitter-like REST API built in **TypeScript**, designed to explore key web backend concepts including:

- Authentication (JWT access + refresh tokens)
- Middleware
- Secure password hashing
- Database migrations (Goose)
- Webhooks (Polka integration)
- Role-based features (Chirpy Red users)
- Clean RESTful API design

---

## 🚀 Features

- 🧑‍💻 **User Management** — Create, update, and authenticate users.
- 💬 **Chirps** — Create and fetch short posts (max 140 chars).
- 🧹 **Profanity Filtering** — Automatically censors certain words (kerfuffle, sharbert, fornax) when posting chirps.
- 🔐 **JWT Authentication** — Protects private routes using Bearer access tokens.
- 🔁 **Refresh Tokens** — Securely refresh access tokens and revoke them when needed.
- 🧾 **Polka Webhooks** — Handles Chirpy Red membership upgrades from the Polka payment provider.
- 🗑️ **Admin Utilities** — Reset metrics and view file server hit counts.

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/SunnyGitGud/chirpyts.git
cd chirpy
```

### 2. Install dependencies
```bash
mise install
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root containing:

```env
DB_URL=postgres://postgres:password@localhost:5432/chirpy?sslmode=disable
SECRET=<your-jwt-secret>
POLKA_KEY=<polka>
PORT=<port>
PLATFORM="dev"
```

- Generate `SECRET` using `openssl rand -base64 64` or similar.

### 4. Run Drizzle-kit Generate
If you use Goose:
```bash
npm run generate
```

Make sure PostgreSQL is running and `DB_URL` points to the correct database.

### 5. Run Drizzle Migrations
```bash
npm run migrate
```

### 6. Start the server
```bash
npm run dev
```

Server will listen on `http://localhost:8080` by default.

---

