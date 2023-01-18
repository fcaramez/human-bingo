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
        input: { name, password },
      }): Promise<{
        message: string;
        success: boolean;
        data: Record<string, any> | null;
      }> => {
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
              isAdmin: true,
            },
          });

          const { name: userName, numberOfGuesses, id, isAdmin } = newUser;

          const payload = {
            userName,
            numberOfGuesses,
            id,
            isAdmin,
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
  login: publicProcedure
    .input(z.object({ name: z.string(), password: z.string() }))
    .mutation(
      async ({
        input: { name, password },
      }): Promise<{
        message: string;
        success: boolean;
        data: Record<string, any> | null;
      }> => {
        try {
          if (!name || !password) {
            return {
              message: "All fields are mandatory!",
              success: false,
              data: null,
            };
          }

          const userToFind = await prisma.player.findFirst({
            where: {
              name: name,
            },
          });

          if (!userToFind) {
            return {
              success: false,
              message: "User does not exist!",
              data: null,
            };
          }

          const verify = await argon.verify(userToFind.password, password);

          if (!verify) {
            return {
              success: false,
              message: "Wrong credentials!",
              data: null,
            };
          }

          const payload = {
            name: userToFind.name,
            numberOfGuesses: userToFind.numberOfGuesses,
            id: userToFind.id,
            isAdmin: userToFind.isAdmin,
          };

          const token = jwt.sign(payload, TOKEN_SECRET as string, {
            algorithm: "HS256",
            expiresIn: "7d",
          });

          return {
            success: true,
            message: `Welcome back ${name}`,
            data: {
              token: token,
              ...payload,
            },
          };
        } catch (_e) {
          return {
            success: false,
            message: "Internal Server Error, call Xico",
            data: null,
          };
        }
      }
    ),
});
