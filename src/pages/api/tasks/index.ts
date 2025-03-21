import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import {
  type CreateTaskInput,
  createTaskSchema,
  taskMemberSchema,
  userEmailsSchema,
} from "@/utils/zod";
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

      const parsedData = await taskMemberSchema.parseAsync({
        taskId: String(task.id),
        userId: String(session.user.id),
        type: "owner",
      });

      await prisma.taskMember.create({ data: parsedData });

      if (parsedBody.userEmails && Array.isArray(parsedBody.userEmails)) {
        const users = await prisma.user.findMany({
          where: { email: { in: parsedBody.userEmails } },
          select: { id: true },
        });

        const taskMembers = users.map((u) => ({
          taskId: task.id,
          userId: u.id,
          type: "member",
        }));

        await prisma.taskMember.createMany({
          data: taskMembers,
          skipDuplicates: true,
        });
      }

      return res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);

      return res.status(500).json({
        error: "Failed to create task",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          members: {
            some: { userId: session.user.id },
          },
        },
        include: {
          members: { include: { user: true } },
        },
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
