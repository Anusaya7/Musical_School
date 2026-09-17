import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    let query = "SELECT * FROM services";
    if (all !== "true") {
      query += " WHERE is_published = 1";
    }
    query += " ORDER BY display_order ASC, id ASC";

    const services = db.prepare(query).all();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
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

    if (!title || !short_description) {
      return NextResponse.json(
        { error: "Title and short description are required." },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const stmt = db.prepare(`
      INSERT INTO services (
        service_number, title, slug, short_description, full_description, bullet_points,
        image, icon, cta_label, cta_link, display_order, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      service_number || "01",
      title,
      generatedSlug,
      short_description,
      full_description || short_description,
      bullet_points || "",
      image || "/images/architecture_exterior_1.jpg",
      icon || "Compass",
      cta_label || "LEARN MORE",
      cta_link || `/services/${generatedSlug}`,
      display_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Services POST error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
