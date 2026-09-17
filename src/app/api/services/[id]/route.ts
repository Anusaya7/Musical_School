import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if lookup is numeric ID or text slug
    let service;
    if (/^\d+$/.test(id)) {
      service = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
    } else {
      service = db.prepare("SELECT * FROM services WHERE slug = ?").get(id);
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error("Service GET ID error:", error);
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
      service_number,
      title,
      slug,
      short_description,
      full_description,
      bullet_points,
      image,
      icon,
      cta_label,
      cta_link,
      display_order,
      is_published,
    } = data;

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const stmt = db.prepare(`
      UPDATE services SET
        service_number = ?,
        title = ?,
        slug = ?,
        short_description = ?,
        full_description = ?,
        bullet_points = ?,
        image = ?,
        icon = ?,
        cta_label = ?,
        cta_link = ?,
        display_order = ?,
        is_published = ?
      WHERE id = ?
    `);

    stmt.run(
      service_number,
      title,
      generatedSlug,
      short_description,
      full_description,
      bullet_points || "",
      image,
      icon,
      cta_label || "LEARN MORE",
      cta_link || `/services/${generatedSlug}`,
      display_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service PUT error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
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
    db.prepare("DELETE FROM services WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
