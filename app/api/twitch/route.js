import { NextResponse } from "next/server";

let twitchAccessToken = null;
let tokenExpiresAt = 0;

async function getTwitchAccessToken() {
  // If token is missing or expired, fetch a new one
  if (!twitchAccessToken || Date.now() > tokenExpiresAt) {
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    });
    const data = await res.json();
    twitchAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // refresh 1 min early
  }
  return twitchAccessToken;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const username = searchParams.get("username");

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
  let token = await getTwitchAccessToken();
  let response = await fetch(
    `https://api.twitch.tv/helix/streams?first=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  // If token expired, refresh and retry once
  if (response.status === 401) {
    token = await getTwitchAccessToken(); // fetch new token
    response = await fetch(
      `https://api.twitch.tv/helix/streams?first=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      }
    );
  }

  if (!response.ok) {
    throw new Error("Failed to fetch streams");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

async function checkStream(username) {
  let token = await getTwitchAccessToken();
  let response = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${username}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  if (response.status === 401) {
    token = await getTwitchAccessToken();
    response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      }
    );
  }

  if (!response.ok) {
    throw new Error("Failed to check stream");
  }

  const data = await response.json();
  return NextResponse.json(data);
}

async function getGames() {
  let token = await getTwitchAccessToken();
  let response = await fetch(
    "https://api.twitch.tv/helix/games/top?first=5",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    }
  );

  if (response.status === 401) {
    token = await getTwitchAccessToken();
    response = await fetch(
      "https://api.twitch.tv/helix/games/top?first=5",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      }
    );
  }

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  return NextResponse.json(data);
}
