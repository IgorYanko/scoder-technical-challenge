import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { id } = req.query;

   if (req.method === 'DELETE') {
      try {
         await prisma.lead.delete({
            where: { id: Number(id) },
         });
         return res.status(200).json({ message: 'Lead deleted successfully' });
      } catch (error) {
         return res.status(500).json({ error: 'Failed to delete lead' });
      }
   }

   return res.status(405).json({ error: 'Method not allowed' });
}