import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../lib/prisma';
import verifyToken from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await prisma.lead.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ message: "Lead deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete lead" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
