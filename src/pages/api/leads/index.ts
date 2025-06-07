import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../lib/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const leads = await prisma.lead.findMany();
      return res.status(200).json(leads);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  }

  if (req.method === "POST") {
    const {
      name,
      email,
      phone,
      cpf,
      city,
      state,
      supplyType,
      monthlyBillValue,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !cpf ||
      !city ||
      !state ||
      !supplyType ||
      !monthlyBillValue
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const existingLead = await prisma.lead.findUnique({ where: { cpf } });

      if (existingLead) {
        return res.status(400).json({ error: "Lead already exists" });
      }

      const newLead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          cpf,
          city,
          state,
          supplyType,
          monthlyBillValue: parseFloat(monthlyBillValue),
        },
      });
      return res.status(201).json(newLead);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create lead" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
