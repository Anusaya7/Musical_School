import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    let query = "SELECT * FROM careers";
    if (all !== "true") {
      query += " WHERE is_published = 1";
    }
    query += " ORDER BY display_order ASC, id DESC";

    const careers = db.prepare(query).all();
    return NextResponse.json(careers);
  } catch (error) {
    console.error("Careers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      title,
      location,
      employment_type,
      description,
      requirements,
      application_email,
      display_order,
      is_published,
    } = data;

    if (!title || !location || !employment_type) {
      return NextResponse.json(
        { error: "Title, location, and employment type are required." },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO careers (
        title, location, employment_type, description, requirements,
        application_email, display_order, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      location,
      employment_type,
      description || "",
      requirements || "",
      application_email || "projects@koralsdesign.com",
      display_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Careers POST error:", error);
    return NextResponse.json({ error: "Failed to create career" }, { status: 500 });
  }
}
