import { prisma } from "@/server/db";
import { signUpSchema } from "@/utils/zod";
import { type NextApiRequest, type NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email, name, password } = await signUpSchema.parseAsync(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        auth: {
          create: { password: hashedPassword },
        },
      },
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(400).json({ error: "Invalid request", details: error });
  }
}
