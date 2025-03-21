import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

// Zod Schema for status update
const updateStatusSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed"]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (typeof id !== "string")
    return res.status(400).json({ error: "Invalid task ID" });

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { status } = await updateStatusSchema.parseAsync(req.body);

    // Check if the user is part of the task
    const isMember = await prisma.taskMember.findFirst({
      where: { taskId: id, userId: session.user.id },
    });

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not assigned to this task" });
    }

    // Update only the task status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res
      .status(400)
      .json({
        error: "Validation Error",
        details: error instanceof z.ZodError ? error.errors : error,
      });
  }
}
