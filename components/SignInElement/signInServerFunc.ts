"use server";
import { signIn, unstable_update } from "@/auth";
import { IUserCredentials } from "@/lib/interfaces";
import { AuthError } from "next-auth";

export async function signInServerFunc(data: IUserCredentials) {
  try {
    await signIn("credentials", { ...data, redirectTo: "/dashboard" });
    await unstable_update({})
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: true, message: error.cause?.err?.message };
    }
    throw error;
  }
}
