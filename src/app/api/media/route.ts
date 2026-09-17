import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const media = db.prepare("SELECT * FROM media ORDER BY id DESC").all();
    return NextResponse.json(media);
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type (image only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeFilename);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    const stmt = db.prepare(`
      INSERT INTO media (filename, filepath, filesize, filetype)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(safeFilename, publicUrl, file.size, file.type);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Media POST upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
