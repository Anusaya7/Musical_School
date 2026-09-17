import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const career = db.prepare("SELECT * FROM careers WHERE id = ?").get(id);
    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }
    return NextResponse.json(career);
  } catch (error) {
    console.error("Career GET ID error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    const stmt = db.prepare(`
      UPDATE careers SET
        title = ?,
        location = ?,
        employment_type = ?,
        description = ?,
        requirements = ?,
        application_email = ?,
        display_order = ?,
        is_published = ?
      WHERE id = ?
    `);

    stmt.run(
      title,
      location,
      employment_type,
      description || "",
      requirements || "",
      application_email || "projects@koralsdesign.com",
      display_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Career PUT error:", error);
    return NextResponse.json({ error: "Failed to update career" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    db.prepare("DELETE FROM careers WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Career DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete career" }, { status: 500 });
  }
}
