"use server";
import { signIn } from "@/auth";
import { IUserSignInAdCredentials } from "@/lib/interfaces";
import { AuthError } from "next-auth";

export async function signInServerFunc(data: IUserSignInAdCredentials) {
  try {
    await signIn("credentials", { ...data, redirectTo: "/dashboard", redirect: false });
    return true
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: true, message: error.cause?.err?.message };
    }
    throw error;
  }
}
