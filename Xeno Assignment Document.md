## 1. Introduction
This project is a complete data ingestion and analytics platform built as part of the given assignment.
The goal of the system is to ingest Shopify store data (customers, products, and orders), store it securely using a multi-tenant architecture, and then provide meaningful insights through a dashboard interface.

The solution includes:
1. Creating Shopify account to generate sample data.
2. A backend service built with Node.js, Express, Prisma, and PostgreSQL.
3. A frontend dashboard built with React and Vite.
4. A cloud-hosted PostgreSQL database on Render.
5. Fully deployed frontend (Vercel) and backend .(Render)

The platform allows any Shopify store to send data to the ingestion API and immediately visualize insights like revenue trends, customer counts, order analytics, and top customers.


## 2. Shopify Setup & Data Export

I created a Shopify Partner account to generate real sample data for this assignment and then set up a development store named xeno-store inside the Shopify dashboard. A development store provides access to Shopify’s admin interface, products, customers, and order-management features without requiring a paid plan. Inside the store, I used Shopify’s built-in sample data tools to automatically populate the store with demo products and customers. Since new stores do not include any orders by default, I manually created several test orders through the Shopify admin panel to ensure that meaningful data would be available for ingestion and analysis.
After preparing the sample store, I downloaded the required data by navigating to:
Shopify Admin → Products / Customers / Orders → Export → csv format (CONVERT THESE FILES TO JSON FORMAT).
These JSON files follow Shopify’s standard schema and contain real structured data for customers, product variants, pricing, timestamps, and transaction amounts. This exported data was then used as the input for the backend ingestion API. 

Each file was uploaded to the endpoint:
**POST /ingest/testTenant/shopify**

The backend processed the Shopify data, normalized inconsistent fields, and saved it into the PostgreSQL database under a single tenant named testTenant, allowing the frontend dashboard to visualize metrics derived directly from real Shopify sample data.

## 3. Backend Architecture & Functionality

The backend is responsible for processing Shopify data, storing it in a structured relational database, and serving analytics through REST APIs. It is built using Node.js, Express, Prisma ORM, and PostgreSQL, ensuring scalability and clarity.

### How the backend works (

When a store sends its Shopify export (customers/products/orders) to the ingestion endpoint, the backend:
1. Creates or identifies the tenant
2. Stores customers, products, and orders in clean, relational tables
3. Calculates metrics like total revenue automatically
4. Exposes analytics APIs consumed by the frontend dashboard

This separation of ingestion vs. analytics keeps the system modular and easy to extend.

## 4. Frontend Architecture & Functionality

The frontend is a React + Vite dashboard deployed on Vercel. Its purpose is to visualize data stored in the backend using clean graphs and responsive UI components.
Once the backend has ingested Shopify data, the frontend:
1. Calls backend APIs using fetch / Axios
2. Displays summary metrics
3. Shows revenue trends in a line graph
4. Lists top customers with their spending

All dynamic data is fetched using:   import.meta.env.VITE_API_URL
This allows seamless switching between development and deployed environments.

## 5. Database Architecture (PostgreSQL + Prisma ORM)

The PostgreSQL database follows a multi-tenant relational model, meaning multiple stores can use the system without mixing data.
The Prisma schema defines four main entities:

1. Tenant
Represents each unique Shopify store using the system.
2. Customer
Stores details such as name, email, and lifetime value (totalSpent).
3. Product
Stores Shopify product details including title and price.
4. Order
Stores order-level data such as total price and creation timestamps.

**Prisma manages migrations, schema validations, and safe database operations.
This avoids raw SQL and ensures better maintainability.**

## 6. Key API Endpoints
Data Ingestion
POST /ingest/:tenantKey/shopify
Used to upload Shopify customers, orders, and products.

1. Summary Insights
GET /metrics/summary?tenantKey=testTenant
Returns: total customers, total orders, total revenue

2. Revenue by Date
GET /metrics/ordersByDate?tenantKey=testTenant
Returns daily revenue trend for charts.

3. Top Customers
GET /metrics/topCustomers?tenantKey=testTenant
Returns highest-spending customers.

## 7. Deployment Overview
### Backend Deployment (Render):
The backend runs on Render as a Node.js web service.
Render automatically:
1. installs dependencies
2. sets environment variables
3. hosts PostgreSQL
4. rebuilds on every commit
5. handles dynamic ports

### Frontend Deployment (Vercel):
The frontend is deployed on Vercel, which automatically builds and hosts the Vite React app.
Environment variables such as the backend URL are configured via the Vercel dashboard.
Both deployments integrate with GitHub, enabling continuous deployment.

## 8. Assumptions Made
All Shopify JSON files provided follow typical Shopify export structure.
A single tenant (testTenant) was used for demonstration.
Shopify customer names or emails might be missing, so defaults such as "Unnamed Customer" are used.
Revenue is computed from totalPrice fields inside orders.

## 9. Conclusion
This project demonstrates a complete data pipeline—from ingestion to visualization—while applying best practices like multi-tenant architecture, ORM-based development, and modern deployment workflows.
The system is modular, scalable, and easy to extend, making it a strong foundation for a production analytics tool.
