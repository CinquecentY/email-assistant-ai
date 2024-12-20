import Account from "@/lib/account";
import { syncEmailsToDatabase } from "@/lib/sync-to-db";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

interface RequestBody {
  accountId: string;
  userId: string;
}

// Initial sync of accounts

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as RequestBody;
  const { accountId, userId } = body;
  if (!accountId || !userId)
    return NextResponse.json(
      {
        error: "INVALID_REQUEST",
        message: `Missing ${!accountId && "accountId "}${!userId && "userId"}`,
      },
      { status: 400 },
    );
  const dbAccount = await db.accounts.findUnique({
    where: {
      id: accountId,
      userId,
    },
  });
  if (!dbAccount)
    return NextResponse.json({ message: "ACCOUNT_NOT_FOUND" }, { status: 404 });

  const account = new Account(dbAccount.token);
  const response = await account.performInitialSync();
  if (!response)
    return NextResponse.json({ message: "FAILED_TO_SYNC" }, { status: 500 });

  const { deltaToken, emails } = response;

  //console.log(deltaToken, emails);

  await syncEmailsToDatabase(emails, accountId);

  await db.accounts.update({
    where: {
      token: dbAccount.token,
    },
    data: {
      nextDeltaToken: deltaToken,
    },
  });
  //console.log("sync complete", deltaToken);
  return NextResponse.json({ success: true, deltaToken }, { status: 200 });
};
