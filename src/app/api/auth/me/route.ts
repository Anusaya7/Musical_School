import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, role: "admin" });
}
