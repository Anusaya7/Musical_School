import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET ID error:", error);
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
      name,
      client,
      location,
      category,
      area,
      description,
      completion_year,
      featured_image,
      gallery_images,
      is_featured,
      display_order,
      is_published,
    } = data;

    const stmt = db.prepare(`
      UPDATE projects SET
        name = ?,
        client = ?,
        location = ?,
        category = ?,
        area = ?,
        description = ?,
        completion_year = ?,
        featured_image = ?,
        gallery_images = ?,
        is_featured = ?,
        display_order = ?,
        is_published = ?
      WHERE id = ?
    `);

    stmt.run(
      name,
      client,
      location,
      category,
      area || "",
      description || "",
      completion_year || "",
      featured_image,
      typeof gallery_images === "string" ? gallery_images : JSON.stringify(gallery_images || []),
      is_featured ? 1 : 0,
      display_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
