import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    const allowedStatuses = ["NEW", "READ", "IN PROGRESS", "REPLIED", "CLOSED"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    db.prepare("UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry PATCH error:", error);
    return NextResponse.json({ error: "Failed to update enquiry status" }, { status: 500 });
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
    db.prepare("DELETE FROM enquiries WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
