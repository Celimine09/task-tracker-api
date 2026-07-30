import prisma from "./prisma.service";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  surname: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      surname,
    },
  });
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const loginUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!existingUser) {
    throw new Error("Invalid credentials");
  }
  if (!existingUser.password) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const { password: _, ...userWithoutPassword } = existingUser;
  return userWithoutPassword;
};

export const loginGoogle = async (code: string) => {
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage",
  );

  const { tokens } = await googleClient.getToken(code);
  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw { statusCode: 400, message: "Invalid Google Token Payload" };
  }

  const {
    email,
    sub: googleId,
    given_name: name,
    family_name: surname,
  } = payload;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || "User",
        surname: surname || "",
        googleId,
        password: null,
      },
    });
  }

  return user;
};

export const verifyAndRefreshUser = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Invalid or expired Refresh Token");
  }
};
