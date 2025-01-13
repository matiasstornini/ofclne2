// app/api/wallet/route.ts
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const currentUser = await getUser();

  if (!currentUser) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { walletAddress: true },
  });

  if (!user?.walletAddress) {
    return NextResponse.json({ error: "No wallet found" }, { status: 404 });
  }

  return NextResponse.json({ walletAddress: user.walletAddress });
}
