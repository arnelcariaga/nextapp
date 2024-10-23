import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api_url } from "@/lib/urls";
import { IModules } from "./lib/interfaces";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        impersonatedBy: {},
      },
      authorize: async (credentials) => {
        if (credentials.impersonatedBy) {
          const session = await auth();

          const res = await fetch(api_url + "/api/sign_in_as", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.token}`,
            },
            body: JSON.stringify({ ...credentials }),
          });

          const { error, message, data } = await res.json();

          if (error) {
            throw new Error(message);
          }
          return data;
        } else {
          const res = await fetch(api_url + "/api/signIn", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ ...credentials }),
          });

          const { error, message, data } = await res.json();

          if (error) {
            throw new Error(message);
          }
          return data;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/not_found"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If the user exists (i.e., when logging in), add custom fields to the JWT
        token.id = user.id;
        token.id_sai = user.id_sai;
        token.id_role = user.id_role;
        token.role_name = user.role.name;
        token.profile_img = user.profile_img;
        token.email = user.email;
        token.name = user.name;
        token.last_name = user.last_name;
        token.username = user.username;
        token.accessToken = user.token;
        token.screens = user.role.screens;
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields from the token to the session object
      if (token) {
        session.user.id_sai = token.id_sai as number;
        session.user.id = token.id as string;
        session.user.id_role = token.id_role as number;
        session.user.role_name = token.role_name as string;
        session.user.profile_img = token.profile_img as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.last_name = token.last_name as string;
        session.user.username = token.username as string;
        session.user.token = token.accessToken as string;
        session.user.screens = token.screens as IModules[];
      }
      return session;
    },
  },
});
