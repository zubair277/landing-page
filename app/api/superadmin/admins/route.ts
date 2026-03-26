import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
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

export async function POST(request: Request) {
  try {
    await requireSuperAdmin(request);

    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      role?: UserRole;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const name = body.name?.trim() || "";
    const role: UserRole = body.role === "super_admin" ? "super_admin" : "restaurant_admin";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name || undefined,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ uid: userRecord.uid });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "MISSING_TOKEN") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (message.includes("email-already-exists")) {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create admin." }, { status: 500 });
  }
}
