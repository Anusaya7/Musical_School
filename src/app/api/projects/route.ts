import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const all = searchParams.get("all");

    let query = "SELECT * FROM projects";
    const params: (string | number)[] = [];

    if (all !== "true") {
      query += " WHERE is_published = 1";
      if (category && category !== "All") {
        query += " AND category = ?";
        params.push(category);
      }
    } else if (category && category !== "All") {
      query += " WHERE category = ?";
      params.push(category);
    }

    query += " ORDER BY display_order ASC, id DESC";

    const projects = db.prepare(query).all(...params);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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

    if (!name || !client || !location || !category || !featured_image) {
      return NextResponse.json(
        { error: "Name, client, location, category, and featured_image are required." },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO projects (
        name, client, location, category, area, description, completion_year,
        featured_image, gallery_images, is_featured, display_order, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
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
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
