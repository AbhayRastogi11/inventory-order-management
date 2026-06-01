# StockFlow Inventory & Order Management System

A professional full-stack assessment project for managing products, customers, orders, and inventory movements. The backend enforces stock correctness inside PostgreSQL transactions; the React frontend provides a responsive operations dashboard.

## Features

- Product CRUD with unique normalized SKUs and controlled stock adjustments
- Customer CRUD with unique normalized email addresses
- Multi-item order placement with backend-calculated totals
- Atomic inventory validation and stock reduction using row locks
- Automatic stock restoration when an active order is cancelled
- Inventory audit log for order and manual stock movements
- FastAPI OpenAPI documentation, Alembic migrations, Docker Compose, tests, and CI

## Architecture

inventory-order-management/
├── backend/
│   ├── alembic/               # Database migrations
│   ├── app/
│   │   ├── api/v1/routes/     # HTTP controllers
│   │   ├── core/              # Environment configuration
│   │   ├── db/                # SQLAlchemy session and metadata
│   │   ├── models/            # Database entities
│   │   ├── schemas/           # Pydantic API contracts
│   │   └── services/          # Transactional business rules
│   ├── scripts/seed.py        # Demo records
│   └── tests/                 # API tests
├── frontend/
│   └── src/
│       ├── api/               # Fetch client
│       ├── components/        # Shared UI components
│       ├── pages/             # Dashboard and management pages
│       └── types/             # TypeScript contracts
├── .github/workflows/         # CI and GHCR image publishing
├── docker-compose.yml
├── render.yaml
└── .env.example



erDiagram
  CUSTOMERS ||--o{ ORDERS : places
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : referenced_by
  PRODUCTS ||--o{ INVENTORY_TRANSACTIONS : tracks


## Step 1: Open the Project in VS Code

From PowerShell:

```powershell
cd inventory-order-management
code .
```

Install Docker Desktop and confirm that Docker is running:

```powershell
docker --version
docker compose version
```

## Step 2: Configure Environment Variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

For local development, the provided defaults work with Docker Compose. Do not commit `.env`.

## Step 3: Start the Complete Application

Run Docker Compose commands from the repository root, where `docker-compose.yml` is located:

```powershell
cd C:\path\to\inventory-order-management
```

```powershell
docker compose up --build
```

Open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8000/health`
- Interactive API documentation: `http://localhost:8000/docs`

In another terminal, load demo products and customers:

```powershell
docker compose exec backend python -m scripts.seed
```

## Step 4: Run Automated Tests

```powershell
docker compose run --rm backend pytest
```

The tests cover:

- Duplicate SKU rejection
- Case-insensitive duplicate email rejection
- Negative-stock adjustment rejection
- Successful order placement and stock reduction
- Insufficient-stock order rejection
- Stock restoration on cancellation

## Business Rule: Atomic Order Placement

`backend/app/services/order_service.py` performs order creation in one database transaction:

1. Validate the customer.
2. Lock every requested product row with `SELECT ... FOR UPDATE`.
3. Validate that every product exists and has sufficient stock.
4. Store the current product price on each order item.
5. Reduce product stock and append inventory audit records.
6. Commit only when the complete order is valid.

If any item lacks stock, the API returns HTTP `409` and no stock is reduced.

## Step 5: Push to GitHub

Create an empty GitHub repository, then run:

```powershell
git init
git add .
git commit -m "Build inventory and order management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-order-management.git
git push -u origin main
```

## Step 6: Deploy PostgreSQL on Neon

1. Create a free Neon project at `https://neon.com`.
2. Copy its pooled PostgreSQL connection string.
3. Change the scheme from `postgresql://` to `postgresql+psycopg://`.
4. Keep this value private. You will add it to Render as `DATABASE_URL`.

Example format:

```text
postgresql+psycopg://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

## Step 7: Deploy the FastAPI Backend on Render

1. Push the repository to GitHub.
2. In Render, select **New > Blueprint** and connect the repository.
3. Render reads `render.yaml`.
4. Add `DATABASE_URL` using your Neon connection string.
5. Add `BACKEND_CORS_ORIGINS` after deploying the frontend, for example `https://your-app.vercel.app`.
6. Confirm that `https://YOUR_RENDER_SERVICE.onrender.com/health` returns `{"status":"ok"}`.
7. Confirm API documentation at `https://YOUR_RENDER_SERVICE.onrender.com/docs`.

Render runs `alembic upgrade head` automatically when the backend container starts.

## Step 8: Deploy the React Frontend on Vercel

1. In Vercel, import the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Use framework preset **Vite**.
4. Add `VITE_API_BASE_URL=https://YOUR_RENDER_SERVICE.onrender.com/api/v1`.
5. Deploy and copy your Vercel URL.
6. Return to Render and set `BACKEND_CORS_ORIGINS` to the Vercel URL.

## Step 9: Publish the Backend Docker Image

The GitHub workflow publishes to GitHub Container Registry when you create a version tag:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

After the workflow succeeds, make the package public in GitHub package settings. Your image path will look like:

```text
ghcr.io/YOUR_USERNAME/inventory-order-management-backend:v1.0.0
```

## Submission Checklist

Replace placeholders and submit:

```text
GitHub repository: https://github.com/YOUR_USERNAME/inventory-order-management
Frontend URL:      https://YOUR_APP.vercel.app
Backend API:       https://YOUR_SERVICE.onrender.com
API documentation:https://YOUR_SERVICE.onrender.com/docs
Docker image:      ghcr.io/YOUR_USERNAME/inventory-order-management-backend:v1.0.0
```

Add screenshots of the dashboard, product list, create-order form, and FastAPI docs to your final submission. Mention that free Render web services may sleep after inactivity, so the first API request can take longer.
