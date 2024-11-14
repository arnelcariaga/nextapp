"use server";
import { signIn } from "@/auth";
import { IUserCredentials } from "@/lib/interfaces";
import { AuthError } from "next-auth";

export async function signInServerFunc(data: IUserCredentials) {
  try {
    await signIn("credentials", { ...data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: true, message: error.cause?.err?.message };
    }
    throw error;
  }
}
