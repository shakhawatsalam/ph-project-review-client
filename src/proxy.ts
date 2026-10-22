import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudentRoute = pathname.startsWith("/student");
  const isMentorRoute = pathname.startsWith("/mentor");

  if (!isStudentRoute && !isMentorRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*"],
};
