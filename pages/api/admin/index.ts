import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
   }

   try {
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });

      if (existingAdmin) {
         return res.status(400).json({ error: 'Admin already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await prisma.admin.create({
         data: {
            email,
            password: hashedPassword,
         },
      });

      return res.status(201).json({ message: 'Admin created', admin: {id: newAdmin.id, email: newAdmin.email } });
   } catch (error) {
      return res.status(500).json({ error: 'Failed to create admin' });
   }
}