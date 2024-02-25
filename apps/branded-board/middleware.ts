// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;

  if (!host && typeof window !== "undefined") {
    // On client side, get the host from window
    host = window.location.host;
  }
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0];

    if (candidate && !candidate.includes("localhost")) {
      // Valid candidate
      subdomain = candidate;
    }
  }
  return subdomain;
};

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();

  // console.log("middleware.ts", url.pathname, req.nextUrl.pathname);

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  if (
    url.pathname.includes("/api/") ||
    url.pathname.includes("robots.txt") ||
    url.pathname.includes("sitemap.xml") ||
    url.pathname.includes("/dashboard")
  ) {
    return;
  }

  const host = req.headers.get("host");
  const subdomain =
    process.env.NEXT_PUBLIC_FORCE_SLUG_LOCALHOST || getValidSubdomain(host);

  // This is a fix for sharing an old url
  if (url.pathname.match(/^\/[a-z0-9-]+\/jobs\/[a-f0-9]+$/)) {
    const jobId = url.pathname.split("/").pop(); // Extract the job ID

    url.pathname = `/jobs/${jobId}`;

    return NextResponse.redirect(url);
  }

  if (url.pathname === "/") {
    if (subdomain && !url.searchParams.get("redirect")) {
      url.pathname = `/jobs`;

      return NextResponse.redirect(url);
    }
  }

  if (subdomain) {
    // Subdomain available, rewriting
    // console.log(
    //   `>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`
    // );
    url.pathname = `/${subdomain}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}
