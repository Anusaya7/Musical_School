import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enquiries = db.prepare("SELECT * FROM enquiries ORDER BY id DESC").all();
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Enquiries GET error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO enquiries (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'NEW')
    `);

    const result = stmt.run(
      name,
      email,
      phone || "",
      subject || "General Inquiry",
      message
    );

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully.",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Enquiry POST error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
