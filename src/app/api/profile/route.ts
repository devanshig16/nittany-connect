import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const data = {
    studentName: body.studentName || null,
    gradYear: body.gradYear ? Number(body.gradYear) : null,
    location: body.location || null,
    occupation: body.occupation || null,
    industry: body.industry || null,
    company: body.company || null,
    bio: body.bio || null,
    lookingFor: body.lookingFor || null,
    linkedinUrl: body.linkedinUrl || null,
    websiteUrl: body.websiteUrl || null,
    isPublic: Boolean(body.isPublic),
  };

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
  });

  return NextResponse.json(profile);
}
