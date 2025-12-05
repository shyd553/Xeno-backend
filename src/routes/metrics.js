const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/summary', async (req, res) => {
  try {
    const { tenantKey } = req.query;

    const tenant = await prisma.tenant.findUnique({ where: { tenantKey } });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const customersCount = await prisma.customer.count({
      where: { tenantId: tenant.id }
    });

    const ordersCount = await prisma.order.count({
      where: { tenantId: tenant.id }
    });

    const revenueAgg = await prisma.order.aggregate({
      where: { tenantId: tenant.id },
      _sum: { totalPrice: true }
    });

    return res.json({
      customersCount,
      ordersCount,
      totalRevenue: revenueAgg._sum.totalPrice || 0
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/ordersByDate', async (req, res) => {
  try {
    const { tenantKey } = req.query;

    const tenant = await prisma.tenant.findUnique({ where: { tenantKey } });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const orders = await prisma.order.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "asc" }
    });

    const map = {};
    orders.forEach(o => {
      const d = o.createdAt.toISOString().slice(0, 10);
      map[d] = (map[d] || 0) + Number(o.totalPrice);
    });

    const result = Object.entries(map).map(([date, revenue]) => ({
      date,
      revenue
    }));

    return res.json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/topCustomers', async (req, res) => {
  try {
    const { tenantKey } = req.query;

    const tenant = await prisma.tenant.findUnique({ where: { tenantKey } });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const customers = await prisma.customer.findMany({
      where: { tenantId: tenant.id },
      orderBy: { totalSpent: "desc" },
      take: 5
    });

    return res.json(customers);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
