import { z } from "zod";
import { prisma } from "../../db";
import { publicProcedure, createTRPCRouter } from "../trpc";
import * as argon from "argon2";
import * as jwt from "jsonwebtoken";

const { TOKEN_SECRET } = process.env;

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ name: z.string(), password: z.string() }))
    .mutation(
      async ({
        input,
      }): Promise<{
        message: string;
        success: boolean;
        data: Record<string, any> | null;
      }> => {
        const { name, password } = input;
        try {
          if (!name || !password) {
            return {
              success: false,
              message: "All fields are mandatory!",
              data: null,
            };
          }

          const userToFind = await prisma.player.findFirst({
            where: {
              name: name,
            },
          });

          if (userToFind) {
            return {
              success: false,
              message: "User Already exists!",
              data: null,
            };
          }

          const hashedPassword = await argon.hash(password);

          const newUser = await prisma.player.create({
            data: {
              name: name,
              password: hashedPassword,
              numberOfGuesses: 0,
            },
            select: {
              name: true,
              numberOfGuesses: true,
              password: false,
              id: true,
            },
          });

          const { name: userName, numberOfGuesses, id } = newUser;

          const payload = {
            userName,
            numberOfGuesses,
            id,
          };

          const authToken = jwt.sign(payload, TOKEN_SECRET as string, {
            algorithm: "HS256",
            expiresIn: "7d",
          });

          return {
            success: true,
            message: `Welcome to Human Bingo, ${name}`,
            data: {
              token: authToken,
              ...payload,
            },
          };
        } catch (_e) {
          return {
            success: false,
            message: "Internal server error, call Xico",
            data: null,
          };
        }
      }
    ),
});
