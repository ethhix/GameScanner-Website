import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const username = searchParams.get("username");

    // Handling different actions through query parameters
    switch (action) {
      case "getStreams":
        return await getStreams(searchParams.get("limit") || 10);
      case "checkStream":
        if (!username) {
          return NextResponse.json(
            { error: "Username required" },
            { status: 400 }
          );
        }
        return await checkStream(username);
      case "getGames":
        return await getGames();
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper functions
async function getStreams(limit) {
  const response = await fetch(
    `https://api.twitch.tv/helix/streams?first=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

async function checkStream(username) {
  const response = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${username}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to check stream");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

async function getGames() {
  const response = await fetch(
    "https://api.twitch.tv/helix/games/top?first=5",
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  return NextResponse.json(data);
}
