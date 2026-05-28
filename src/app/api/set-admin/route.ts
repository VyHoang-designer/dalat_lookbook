import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (profiles.length > 0) {
      const targetUser = profiles[0];
      const updated = await prisma.profile.update({
        where: { id: targetUser.id },
        data: { role: "admin" },
      });

      return NextResponse.json({
        success: true,
        message: `Set ${targetUser.fullName || targetUser.id} as admin!`,
        profile: updated,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No users found in the database. Please register first.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
