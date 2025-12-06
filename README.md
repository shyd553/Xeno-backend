# Xeno Data Ingestion & Insights – Backend (Node.js + Prisma + PostgreSQL) 
The main job is to take Shopify data (customers, products, and orders), store it in a PostgreSQL database, and expose APIs that calculate useful business insights.  
The service is built using **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**, and is fully deployed on **Render**.

## Deployed Backend
https://xeno-backend-5e1f.onrender.com/

## Working of Backend
2 main responsibilities are:
### 1. **Data Ingestion**
Backend accepts Shopify JSON exports and stores:
- Customers  
- Products  
- Orders  
All the data is saved under a specific tenant so multiple stores can be supported separately.

### 2. **Metrics & Insights**
Backend exposes APIs that calculate:
- Total customers  
- Total orders  
- Total revenue  
- Revenue grouped by date  
- Top customers by spending  
These APIs are consumed by the React frontend dashboard.

## Tech Stack

- **Node.js + Express** → for server and API routing  
- **Prisma ORM** → for database operations  
- **PostgreSQL (Render Cloud DB)** → primary persistent storage  
- **Render** → cloud hosting and deployment  

## Database Schema (PostgreSQL + Prisma ORM)
The PostgreSQL database follows a multi-tenant relational model, meaning multiple stores can use the system without mixing data.
Prisma is used to define the database structure.  
The schema includes the following four models:

- **Tenant** — separates data for different Shopify stores  
- **Customer** — stores customer details and lifetime value  
- **Product** — represents Shopify products  
- **Order** — stores order-level details including revenue  
Relationships are mapped so that metrics like total revenue or top customers can be computed easily.

## Working of server.js, ingest.js, metrics.js, schema.prisma

### `server.js`
Initializes Express, loads routes, configures middleware, and starts the server.

### `ingest.js`
Handles the ingestion of Shopify data and inserts customers, products, and orders into PostgreSQL.

### `metrics.js`
Contains APIs that compute summary statistics, revenue by date, and top customers.

### `schema.prisma`
Defines all database models and relations. Prisma generates the database tables automatically through migrations.

## API Endpoints

### 1. Ingest Shopify Data
POST /ingest/:tenantKey/shopify
Body includes:(data from json files)
{
  "customers": [...],
  "products": [...],
  "orders": [...]
}
### 2. Summary Insights
GET /metrics/summary?tenantKey=testTenant
**link-** https://xeno-backend-5e1f.onrender.com/metrics/summary?tenantKey=testTenant
### 3. Revenue By Date
GET /metrics/ordersByDate?tenantKey=testTenant
**link-** https://xeno-backend-5e1f.onrender.com/metrics/ordersByDate?tenantKey=testTenant
### 4. Top 5 Customers
GET /metrics/topCustomers?tenantKey=testTenant
**link-** https://xeno-backend-5e1f.onrender.com/metrics/topCustomers?tenantKey=testTenant

**Each API uses Prisma to fetch and aggregate data efficiently.**

## Environment Variables

The backend uses a .env file to store sensitive values:
DATABASE_URL=postgres://<render-connection-string>
PORT=10000
Render automatically injects the correct environment variables during deployment.

## How to run locally
1. npm install
2. npx prisma migrate dev
3. node server.js
4. The server runs at localhost 4000

## Deployment on Render
First, we will create repository on github and push our code to github.
Use command:
1. git init- to start git
2. git add .- to stage files
3. git commit -m "Initial commit" - to commit
4. git remote add origin https://github.com/shyd553/Xeno-bronend.git- add github repository URL
5. git branch -M main - push code to git
6. git push -u origin main - push code to github
   
The backend is deployed as a Render Web Service.
Render listens for new commits on GitHub and redeploys automatically.
The PostgreSQL database is also hosted on Render, and Prisma migrations keep the schema in sync.


## Author
**Shubhra Yadav**
