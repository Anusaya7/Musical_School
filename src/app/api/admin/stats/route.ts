import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalProjects = (db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number }).c;
    const activeServices = (db.prepare("SELECT COUNT(*) as c FROM services WHERE is_published = 1").get() as { c: number }).c;
    const openJobs = (db.prepare("SELECT COUNT(*) as c FROM careers WHERE is_published = 1").get() as { c: number }).c;
    const newEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'NEW'").get() as { c: number }).c;
    const totalEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries").get() as { c: number }).c;

    return NextResponse.json({
      totalProjects,
      activeServices,
      openJobs,
      newEnquiries,
      totalEnquiries,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
