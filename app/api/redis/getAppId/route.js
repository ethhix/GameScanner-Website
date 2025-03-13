import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Name parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://redis-server-toxf.onrender.com/getAppId/${encodeURIComponent(
        name
      )}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Game not found in Redis" },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Redis server" },
      { status: 500 }
    );
  }
}
