import { getAccountDetails, getAurinkoToken } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import axios, { type AxiosError } from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { error: "Account connection failed" },
      { status: 400 },
    );

  const code = params.get("code");
  const token = await getAurinkoToken(code!);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );
  const accountDetails = await getAccountDetails(token.accessToken);
  await db.accounts.upsert({
    where: { email: accountDetails.email, userId },
    create: {
      id: token.accountId.toString(),
      userId,
      token: token.accessToken,
      provider: "Aurinko",
      email: accountDetails.email,
      name: accountDetails.name,
    },
    update: {
      id: token.accountId.toString(),
      token: token.accessToken,
    },
  });
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err: AxiosError) => {
        if (err.response) console.log(err.response.data);
      }),
  );

  return NextResponse.redirect(
    new URL(`/mail?accountId=${token.accountId.toString()}`, req.url),
  );
};
