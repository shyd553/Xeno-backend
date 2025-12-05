const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/:tenantKey/shopify", async (req, res) => {
  try {
    const { tenantKey } = req.params;
    const { customers = [], products = [], orders = [] } = req.body;

    // 1️⃣ Ensure tenant exists
    let tenant = await prisma.tenant.findUnique({ where: { tenantKey } });
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { tenantKey, name: tenantKey },
      });
    }

    // 2️⃣ Ingest Customers
    for (const c of customers) {
      await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          shopifyId:
            (c.id || c.ID || c["Customer ID"] || c["ID"])?.toString() || null,
          email: c.email || c.Email || null,
          name: c.name || c.Name || c["Customer Name"] || "Unnamed Customer",
          totalSpent:
            Number(
              c.totalSpent ||
                c["Total Spent"] ||
                c["TotalSpent"] ||
                c["Amount Spent"]
            ) || 0,
        },
      });
    }

    // 3️⃣ Ingest Products (ROBUST VERSION)
    for (const p of products) {
      await prisma.product.create({
        data: {
          tenantId: tenant.id,

          shopifyId:
            (p.id || p.ID || p["Product ID"] || p["Variant ID"])?.toString() ||
            null,

          // Handle different possible product title fields
          title:
            p.title ||
            p.Title ||
            p.Name ||
            p["Product Title"] ||
            p["Product name"] ||
            p.handle ||
            "Untitled Product",

          // Handle different possible price fields
          price:
            Number(
              p.price ||
                p.Price ||
                p["Variant Price"] ||
                p["Unit Price"] ||
                p["Amount"] ||
                p["Retail Price"]
            ) || 0,
        },
      });
    }

    // 4️⃣ Ingest Orders
    for (const o of orders) {
      await prisma.order.create({
        data: {
          tenantId: tenant.id,

          shopifyId:
            (o.id || o.ID || o["Order ID"] || o["ID"])?.toString() || null,

          totalPrice:
            Number(
              o.total_price ||
                o["Total Price"] ||
                o["Total"] ||
                o["Amount"] ||
                o["Order Amount"]
            ) || 0,

          createdAt: new Date(
            o.created_at ||
              o["Created At"] ||
              o["Order Date"] ||
              new Date().toISOString()
          ),
        },
      });
    }

    return res.json({
      ok: true,
      message: "Data ingested successfully into PostgreSQL",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
