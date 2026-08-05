import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth?.user
  
  const isStudentRoute = nextUrl.pathname.startsWith("/student")
  const isInstructorRoute = nextUrl.pathname.startsWith("/instructor")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") && nextUrl.pathname !== "/admin/login"

  if (isStudentRoute || isInstructorRoute || isAdminRoute) {
    if (!isLoggedIn) {
      const redirectUrl = isAdminRoute ? "/admin/login" : "/login"
      return Response.redirect(new URL(redirectUrl, nextUrl))
    }

    const role = (req.auth?.user as any)?.role?.toUpperCase() || "STUDENT"
    const isVerified = (req.auth?.user as any)?.isVerified

    if (isStudentRoute && role === "STUDENT" && !isVerified) {
      return Response.redirect(new URL("/verify-email", nextUrl))
    }
    
    if (isAdminRoute && role !== "SUPER_ADMIN") {
      return Response.redirect(new URL("/unauthorized", nextUrl))
    }
    if (isInstructorRoute && role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "INSTRUCTOR") {
      return Response.redirect(new URL("/unauthorized", nextUrl))
    }
    if (isStudentRoute && role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "INSTRUCTOR" && role !== "STUDENT") {
      return Response.redirect(new URL("/unauthorized", nextUrl))
    }
  }
})

export const config = {
  matcher: [
    "/student",
    "/student/:path*",
    "/instructor",
    "/instructor/:path*",
    "/admin",
    "/admin/:path*"
  ],
}
