import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import { updateNameSchema } from "@/utils/zod";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { name } = await updateNameSchema.parseAsync(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    return res
      .status(200)
      .json({ message: "Name updated successfully", name: updatedUser.name });
  } catch (error) {
    console.error("Update Name Error:", error);
    return res.status(400).json({
      error: "Invalid input",
      details: error instanceof Error ? error.message : error,
    });
  }
}
