import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { createAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const admin = db
      .prepare("SELECT * FROM admins WHERE username = ?")
      .get(username) as { id: number; username: string; password_hash: string } | undefined;

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = await createAdminToken(admin.username);

    const response = NextResponse.json({
      success: true,
      user: { username: admin.username },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
