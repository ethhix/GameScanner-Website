import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const appid = url.searchParams.get("appid");

  if (!appid) {
    return NextResponse.json({ error: "App ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Steam API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Steam API" },
      { status: 500 }
    );
  }
}
