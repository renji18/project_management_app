import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch user details", details: error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: session.user.id },
      });

      res.setHeader("Set-Cookie", [
        "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      ]);

      return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete account", details: error });
    }
  }
}
