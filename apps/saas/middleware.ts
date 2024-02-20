// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.host.includes("edenprotocol.app")) {
    return NextResponse.redirect(
      "http://developer-dao.joineden.ai" + url.pathname
    );
  }

  return;
}
