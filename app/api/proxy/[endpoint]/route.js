import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { endpoint } = params;

  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://proxy-server-j4qa.onrender.com/igdb/${endpoint}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "text/plain",
        },
        body: query,
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `IGDB ${endpoint} error` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch from IGDB ${endpoint}` },
      { status: 500 }
    );
  }
}
