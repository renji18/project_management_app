import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import { type CreateTaskInput, createTaskSchema } from "@/utils/zod";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    try {
      const parsedBody: CreateTaskInput = await createTaskSchema.parseAsync(
        req.body,
      );

      const task = await prisma.task.create({
        data: {
          title: parsedBody.title,
          description: parsedBody.description,
          priority: parsedBody.priority,
          deadline: parsedBody.deadline ? new Date(parsedBody.deadline) : null,
          userId: session.user.id,
        },
      });

      return res.status(201).json(task);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create task", details: error });
    }
  }

  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(tasks);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch tasks", details: error });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
