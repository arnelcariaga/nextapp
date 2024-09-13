import NextAuth from "next-auth";
import { IUser } from "@/lib/interfaces";

declare module "next-auth" {
  interface Session {
    user: IUser;
  }

  interface User extends IUser {}

  interface JWT extends IUser {}
}
