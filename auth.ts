import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api_url } from "@/lib/urls";

interface IUserSignInDataResponse {
  id: number;
  profile_img: string;
  name: string;
  last_name: string;
  doc_id: string;
  email: string;
  status: number;
  created_at: string;
  updated_at: string;
  username: string;
  id_sai: number;
  id_role: number;
  role: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    is_admin: false;
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
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

        // return user object with their profile data
        return data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If the user exists (i.e., when logging in), add custom fields to the JWT
        // token.id = user.id;
        token.id_role = user.id_role;
        token.role_name = user.role.name;
        token.profile_img = user.profile_img;
        token.email = user.email;
        token.name = user.name;
        token.last_name = user.last_name;
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields from the token to the session object
      if (token) {
        //session.user.id = token.id as string;
        session.user.id_role = token.id_role as number;
        session.user.role_name = token.role_name as string;
        session.user.profile_img = token.profile_img as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.last_name = token.last_name as string;
      }
      return session;
    },
  },
});
