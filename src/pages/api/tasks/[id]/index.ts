import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import { updateTaskSchema } from "@/utils/zod";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;
  if (typeof id !== "string")
    return res.status(400).json({ error: "Invalid task ID" });

  const isOwner = await prisma.taskMember.findFirst({
    where: {
      taskId: id,
      userId: session.user.id,
      type: "owner",
    },
  });

  if (!isOwner) {
    return res
      .status(403)
      .json({ error: "Forbidden: Only the owner can modify the task" });
  }

  if (req.method === "PUT") {
    try {
      const parsedData = await updateTaskSchema.parseAsync(req.body);

      const updatedTask = await prisma.task.update({
        where: { id, userId: session.user.id },
        data: {
          title: parsedData.title,
          description: parsedData.description,
          priority: parsedData.priority,
          status: parsedData.status,
          deadline: parsedData.deadline ? new Date(parsedData.deadline) : null,
        },
      });

      if (parsedData.userEmails && Array.isArray(parsedData.userEmails)) {
        const users = await prisma.user.findMany({
          where: { email: { in: parsedData.userEmails } },
          select: { id: true },
        });

        const taskMembers = users.map((user) => ({
          taskId: id,
          userId: user.id,
          type: "member",
        }));

        await prisma.taskMember.createMany({
          data: taskMembers,
          skipDuplicates: true,
        });
      }

      return res.status(200).json(updatedTask);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ error: "Validation Error", details: error.errors });
      }
      console.error(error);
      return res.status(500).json({ error: "Failed to update task" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.task.delete({
        where: { id, userId: session.user.id },
      });

      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete task" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
