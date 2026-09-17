import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const settings = db.prepare("SELECT * FROM site_settings").all() as { key: string; value: string }[];
    const homepage = db.prepare("SELECT * FROM homepage_content").all() as { key: string; value: string }[];
    const about = db.prepare("SELECT * FROM about_content").all() as { key: string; value: string }[];
    const leadership = db.prepare("SELECT * FROM leadership ORDER BY display_order ASC").all();

    const siteSettingsObj: Record<string, string> = {};
    settings.forEach((s) => (siteSettingsObj[s.key] = s.value));

    const homepageObj: Record<string, string> = {};
    homepage.forEach((h) => (homepageObj[h.key] = h.value));

    const aboutObj: Record<string, string> = {};
    about.forEach((a) => (aboutObj[a.key] = a.value));

    return NextResponse.json({
      siteSettings: siteSettingsObj,
      homepage: homepageObj,
      about: aboutObj,
      leadership,
    });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { section, data } = await req.json();

    if (!section || !data) {
      return NextResponse.json({ error: "Section and data required" }, { status: 400 });
    }

    let tableName = "";
    if (section === "siteSettings") tableName = "site_settings";
    else if (section === "homepage") tableName = "homepage_content";
    else if (section === "about") tableName = "about_content";
    else return NextResponse.json({ error: "Invalid section" }, { status: 400 });

    const stmt = db.prepare(`INSERT OR REPLACE INTO ${tableName} (key, value) VALUES (?, ?)`);
    for (const [key, value] of Object.entries(data)) {
      stmt.run(key, String(value));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
