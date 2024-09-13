import { auth } from "@/auth";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const auth = req.auth;
  const origin = req.nextUrl.origin;

  // If user is not authenticated and he go to this protected routes then redirect to signIn page
  if (
    !auth && pathname === "/dashboard" ||
    !auth && pathname === "/roles"
  ) {
    const newUrl = new URL("/", origin);
    return Response.redirect(newUrl);
  } else if (
    // If the user access to this routes and it's authenticated then redirect to not_found page
    auth && pathname === "/"
  ) {
    const newUrl = new URL("/not_found", origin);
    return Response.redirect(newUrl);
  }
});

// export const config = {
//   matcher: [
//     "/profile/:path*",
//     "/dashboard/:path*",
//     "/signIn",
//     "/signUp/:path*",
//   ], // routes to apply middleware
// };
