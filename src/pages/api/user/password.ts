import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db";
import { updatePasswordSchema } from "@/utils/zod";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { oldPassword, newPassword } = await updatePasswordSchema.parseAsync(
      req.body,
    );

    const user = await prisma.auth.findUnique({
      where: { userId: session.user.id },
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.auth.update({
      where: { userId: session.user.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error, "err");

    return res.status(400).json({ error: "Invalid input", details: error });
  }
}
