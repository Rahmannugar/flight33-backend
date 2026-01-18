# Flight33 Backend

Flight33 is a flight search engine designed to bring transparency to air travel costs.
This backend aggregates live availability from Amadeus and transforms raw data into **price trends**—giving users historical context, not just current prices.

It allows us to serve rich, real-time visual data without hammering the external API, thanks to a heavy focus on deterministic caching.

## Features

## Features

- **Real-Time Integration**: Aggregates live flight availability via the Amadeus API with normalized response structures.
- **Derived Analytics**: Computes price trends purely from cached historical data, enabling zero-latency insights without additional upstream API calls.
- **Deterministic Caching**: Uses hashed search parameters to maximize Redis cache hit rates (10m TTL), protecting quotas and ensuring sub-millisecond access for repeat queries.
- **Robust Engineering**: Enforces strict boundaries with Zod runtime validation, end-to-end TypeScript safety, and hybrid OpenAPI/Swagger documentation.

## Tech Stack

- **Core**: Node.js 22, Express 5, TypeScript
- **Data**: Redis (Cache + Persistence)
- **Infra**: Docker, Render

## Architecture

We designed the system to be **modular and testable**. We strictly separate "how data is retrieved" from "how business rules are applied."

```text
src/
├─ routes/      # Thin controllers (HTTP concerns only)
├─ services/    # Pure business logic (Search, Trends)
├─ lib/         # External adapters (Redis, Amadeus)
├─ schemas/     # Zod schemas (Type safety at the gate)
└─ middleware/  # Global error handling
```

## Getting Started

1. **Environment**
   Copy `.env.example` to `.env` and fill in your Amadeus API credentials.

2. **Local Development**
   The easiest way to run locally (API + Redis):
   ```bash
   docker compose up --build
   ```
   The API will be available at `http://localhost:4000`.
   Docs: `http://localhost:4000/docs`

3. **Local Development (Redis only)**
   If you prefer running Node locally for hot-reloading:
   ```bash
   docker compose up -d redis  # Start just Redis
   pnpm install
   pnpm dev
   ```