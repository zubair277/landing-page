import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import type { UserRole } from "@/types";

async function requireSuperAdmin(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    throw new Error("MISSING_TOKEN");
  }

  const adminAuth = getAdminAuth();
  const adminDb = getAdminDb();
  const decoded = await adminAuth.verifyIdToken(token);
  const profileSnap = await adminDb.collection("users").doc(decoded.uid).get();
  const profile = profileSnap.data() as { role?: UserRole } | undefined;

  if (!profile || profile.role !== "super_admin") {
    throw new Error("FORBIDDEN");
  }

  return { uid: decoded.uid };
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    const requester = await requireSuperAdmin(request);
    const params = await context.params;
    const targetUid = params.uid;

    if (!targetUid) {
      return NextResponse.json({ error: "Missing uid." }, { status: 400 });
    }

    if (targetUid === requester.uid) {
      return NextResponse.json(
        { error: "You cannot delete your own super admin account." },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();
    const targetProfileSnap = await adminDb.collection("users").doc(targetUid).get();
    const targetProfile = targetProfileSnap.data() as { role?: UserRole } | undefined;

    if (targetProfile?.role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot delete a super admin account." },
        { status: 409 }
      );
    }

    const ownedRestaurants = await adminDb
      .collection("restaurants")
      .where("ownerUid", "==", targetUid)
      .limit(1)
      .get();

    if (!ownedRestaurants.empty) {
      return NextResponse.json(
        { error: "Cannot delete admin with linked restaurants." },
        { status: 409 }
      );
    }

    const adminAuth = getAdminAuth();
    await adminAuth.deleteUser(targetUid);
    await adminDb.collection("users").doc(targetUid).delete();

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "MISSING_TOKEN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (message.includes("user-not-found")) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete admin." }, { status: 500 });
  }
}
