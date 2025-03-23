"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// List of Twitch Categories to not display game data for
const ignoreGameTitle = [
  "Just Chatting",
  "I'm Only Sleeping",
  "IRL",
  "Art",
  "Music",
  "Food & Drink",
  "ASMR",
  "Travel & Outdoors",
  "Creative",
  "Software & Game Development",
  "Software and Game Development",
  "Animals, Aquariums, and Zoos",
  "Games + Demos",
  "Retro",
  "Special Events",
  "Talk Shows & Podcasts",
  "Makers & Crafting",
  "Virtual Casino",
];

// Valid platforms to include
const validPlatforms = [
  "PlayStation",
  "Xbox",
  "Nintendo",
  "PC",
  "Linux",
  "Mac",
];

const romanToNumber = {
  I: "1",
  II: "2",
  III: "3",
  IV: "4",
  V: "5",
  VI: "6",
  VII: "7",
  VIII: "8",
  IX: "9",
  X: "10",
  XI: "11",
  XII: "12",
  XIII: "13",
  XIV: "14",
  XV: "15",
};

// Constants for API URLs
const PROXY_MANAGER_URL = "/api/proxy";
const REDIS_SERVER_URL = "/api/redis";

const websiteIDs = [1, 13, 16, 17];

export default function GameHoverCard({ gameName }) {
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [appId, setAppId] = useState(null);
  const [isFound, setIsFound] = useState(true);
  const hoverRef = useRef(null);
  const loadingStartTimeRef = useRef(0);
  const gameRef = useRef(null);
  const ignoreGameListRef = useRef([]);
  const containerRef = useRef(null);

  // Skip non-game categories
  if (ignoreGameTitle.includes(gameName)) {
    return (
      <span className="text-[#bf94ff] hover:text-[#9147ff] hover:underline">
        {gameName}
      </span>
    );
  }

  useEffect(() => {
    if (
      showCard &&
      !gameData &&
      !isLoading &&
      !ignoreGameTitle.includes(gameName)
    ) {
      fetchGameData();
    }
  }, [showCard, gameName, gameData, isLoading]);

  function normalizeSteamName(name) {
    return name
      .toLowerCase()
      .replace(/™/g, "")
      .replace(/®/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const getAppId = async (gameName) => {
    const name = normalizeSteamName(gameName);
    try {
      const response = await fetch(
        `${REDIS_SERVER_URL}/getAppId?name=${encodeURIComponent(name)}`
      );
      if (!response.ok) {
        console.log(`Game not found in Redis: ${name}`);
        return null;
      }
      const data = await response.json();
      return data.appID;
    } catch (err) {
      console.error("Error fetching AppID:", err);
      return null;
    }
  };

  const fetchGameData = async () => {
    if (ignoreGameTitle.includes(gameName)) return;

    setIsLoading(true);
    loadingStartTimeRef.current = Date.now();
    ignoreGameListRef.current = []; // Reset ignore list for each new fetch

    try {
      // First try to get the Steam AppID
      let steamAppId = null;
      try {
        steamAppId = await getAppId(gameName);
        setAppId(steamAppId);
      } catch (error) {
        console.error("Steam AppID lookup failed, continuing without it");
      }

      const gameDetails = await processGame(gameName, steamAppId);

      // Ensure minimum loading time for better UX
      const loadingDuration = Date.now() - loadingStartTimeRef.current;
      const minLoadingTime = 500;
      if (loadingDuration < minLoadingTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadingTime - loadingDuration)
        );
      }

      if (gameDetails) {
        setGameData(gameDetails);
        setIsFound(true);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      setIsFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const processGame = async (gameName, appId) => {
    try {
      let candidates = await getGameID(gameName, {
        isFormatted: false,
        attemptNormalSearch: false,
      });

      if (!candidates) {
        return null;
      }

      for (const gameID of candidates) {
        if (ignoreGameListRef.current.includes(gameID)) continue;

        const isValid = await checkResponse(gameID);
        if (isValid) {
          const details = await getGameDetails(gameID, appId);
          if (details) {
            // Fallback for price
            if (!details.price) {
              details.price = "Price unavailable";
            }
            return details;
          }
        }
      }
      return null;
    } catch (err) {
      console.error("Error in processGame:", err);
      return null;
    }
  };

  const formatGameTitleStrict = (input) => {
    const cleanedInput = input.replace(/[^a-zA-Z0-9'\s]/g, "");

    const formattedInput = cleanedInput.replace(
      /\b(I{1,3}|IV|V|VI{0,3}|IX|X)\b/gi,
      (match) => romanToNumber[match.toUpperCase()] || match
    );

    const isUpperCase = (word) => word === word.toUpperCase();

    return formattedInput
      .split(" ")
      .map((word) =>
        isUpperCase(word)
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word
      )
      .join(" ");
  };

  const getGameID = async (gameName, options = {}) => {
    const { isFormatted = false, attemptNormalSearch = false } = options;
    const gameTitle = !isFormatted ? formatGameTitleStrict(gameName) : gameName;

    try {
      const queryBody = attemptNormalSearch
        ? `fields game, name, published_at; search "${gameTitle}";`
        : `fields game, name, published_at; where name = "${gameTitle}";`;

      const response = await fetch(`${PROXY_MANAGER_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryBody,
          endpoint: "search",
        }),
      });

      if (!response.ok) {
        console.error("IGDB search error:", response.status);
        return null;
      }

      const data = await response.json();
      const sortedGames = sortGamesAsc(data);

      const normalizedInput = gameTitle
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/ii/g, "2")
        .replace(/iii/g, "3")
        .replace(/\s+/g, " ")
        .trim();

      const candidates = [];
      for (const element of sortedGames) {
        const normalizedElementName = element.name
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .replace(/ii/g, "2")
          .replace(/iii/g, "3")
          .replace(/\s+/g, " ")
          .trim();

        if (
          normalizedElementName === normalizedInput &&
          element.game !== undefined &&
          !ignoreGameListRef.current.includes(element.game)
        ) {
          candidates.push(element.game);
        }
      }

      if (candidates.length === 0) {
        if (!isFormatted) {
          return getGameID(gameName, {
            isFormatted: true,
            attemptNormalSearch,
          });
        } else if (!attemptNormalSearch) {
          return getGameID(gameName, {
            isFormatted: true,
            attemptNormalSearch: true,
          });
        } else {
          return null;
        }
      }

      return candidates.length > 0 ? candidates : null;
    } catch (err) {
      console.error("Error fetching game ID:", err);
      return null;
    }
  };

  const sortGamesAsc = (response) => {
    return response.sort((a, b) => {
      const dateA = a.published_at || 0;
      const dateB = b.published_at || 0;
      return dateB - dateA;
    });
  };

  const checkResponse = async (game) => {
    try {
      const response = await fetch(`${PROXY_MANAGER_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `fields name, genres.name, websites.category, websites.url, first_release_date; where id = ${game};`,
          endpoint: "games",
        }),
      });

      const data = await response.json();

      if (data.length === 0) {
        console.warn(`No data found for game ID: ${game}`);
        ignoreGameListRef.current.push(game);
        return false;
      }

      if (!data[0] || !data[0].name || !data[0].genres || !data[0].websites) {
        ignoreGameListRef.current.push(game);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking response:", error);
      ignoreGameListRef.current.push(game);
      return false;
    }
  };

  const getAppIdFromSteamUrl = (url) => {
    const regex = /\/app\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getGameDetails = async (gameID, appId) => {
    try {
      const gameData = {
        first_release_date: new Date().toLocaleDateString(),
        genres: [],
        name: "",
        websites: [],
        price: "Price not available",
        platforms: [],
      };

      if (appId) {
        try {
          const steamResponse = await fetch(`/api/steam?appid=${appId}`);
          if (steamResponse.ok) {
            const steamData = await steamResponse.json();
            if (steamData[appId]?.success) {
              if (steamData[appId].data?.is_free) {
                gameData.price = "Free";
              } else if (
                steamData[appId].data?.price_overview?.final_formatted
              ) {
                gameData.price =
                  steamData[appId].data.price_overview.final_formatted;
              }
            }
          }
        } catch (error) {
          console.error("Error fetching Steam data:", error);
        }
      }

      const response = await fetch(`${PROXY_MANAGER_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `fields name, genres.name, platforms.name, websites.category, websites.url, first_release_date; where id = ${gameID};`,
          endpoint: "games",
        }),
      });

      const igdbData = await response.json();

      if (!igdbData?.length) {
        return null;
      }

      if (igdbData[0].genres) {
        igdbData[0].genres.forEach((genre) => {
          gameData.genres.push(genre.name);
        });
      }

      if (igdbData[0].platforms) {
        igdbData[0].platforms.forEach((platform) => {
          gameData.platforms.push(platform.name);
        });
      }

      let steamURL;
      if (igdbData[0].websites) {
        igdbData[0].websites.forEach((website) => {
          if (websiteIDs.includes(website.category)) {
            if (website.category === 13) {
              steamURL = website.url;
            }
            gameData.websites.push({
              id: website.category,
              url: website.url,
            });
          }
        });
        if (!steamURL && appId) {
          gameData.websites.push({
            id: 13,
            url: `https://store.steampowered.com/app/${appId}/`,
          });
        }
      }

      if (!appId && steamURL) {
        const extractedAppId = getAppIdFromSteamUrl(steamURL);
        if (extractedAppId) {
          try {
            await fetch(`${REDIS_SERVER_URL}/addAppId`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gameName: igdbData[0].name,
                appId: extractedAppId,
              }),
            });
          } catch (error) {
            console.error("Error adding AppID to Redis:", error);
          }
        }
      }

      if (igdbData[0].first_release_date) {
        gameData.first_release_date = new Date(
          igdbData[0].first_release_date * 1000
        ).toLocaleDateString();
      }

      gameData.name = igdbData[0].name || "Unknown";

      return gameData;
    } catch (error) {
      console.error("Error in getGameDetails:", error);
      return null;
    }
  };

  const handleMouseEnter = () => {
    setShowCard(true);
  };

  const handleMouseLeave = (e) => {
    if (e.relatedTarget !== null && e.relatedTarget !== undefined) {
      if (!containerRef.current?.contains(e.relatedTarget)) {
        setShowCard(false);
      }
    } else {
      setShowCard(false);
    }
  };

  // Position the hover container
  useEffect(() => {
    if (showCard && hoverRef.current && gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect();
      hoverRef.current.style.top = `${rect.bottom + window.scrollY}px`;
      hoverRef.current.style.left = `${rect.left + window.scrollX}px`;
      // No gap between elements
      hoverRef.current.style.marginTop = "0";
    }
  }, []);

  // Platform icons
  const getPlatformIcon = (platform) => {
    if (platform.includes("PlayStation"))
      return "/assets/icons/playstation-icon.png";
    if (platform.includes("Xbox")) return "/assets/icons/xbox-icon.png";
    if (platform.includes("Nintendo")) return "/assets/icons/nintendo-icon.png";
    if (platform.includes("PC")) return "/assets/icons/windows-icon.png";
    if (platform.includes("Mac")) return "/assets/icons/apple-icon.png";
    if (platform.includes("Linux")) return "/assets/icons/linux-icon.png";
    return null;
  };

  return (
    <div ref={containerRef} className="" onMouseLeave={handleMouseLeave}>
      <span
        ref={gameRef}
        className="text-[#bf94ff] hover:text-[#9147ff] hover:underline cursor-pointer"
        onMouseEnter={handleMouseEnter}
      >
        {gameName}
      </span>

      {showCard && (
        <div
          ref={hoverRef}
          style={{
            position: "absolute",
            zIndex: "9999",
            minWidth: "260px",
            maxWidth: "300px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            fontSize: "13px",
            fontFamily: "Roobert, sans-serif",
            marginTop: "0",
          }}
          onMouseEnter={handleMouseEnter}
        >
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "15px",
                backgroundColor: "rgba(23, 20, 31, 0.95)",
                borderRadius: "4px",
              }}
            >
              <div className="lds-ring mx-auto">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p
                style={{ marginTop: "10px", color: "white", fontSize: "14px" }}
              >
                Loading game data...
              </p>
            </div>
          ) : !isFound || !gameData ? (
            <div
              style={{
                textAlign: "center",
                padding: "15px",
                backgroundColor: "rgba(23, 20, 31, 0.95)",
                borderRadius: "4px",
              }}
            >
              <strong style={{ color: "white" }}>Game Not Found</strong>
            </div>
          ) : (
            <div
              style={{
                padding: "15px",
                backgroundColor: "rgba(23, 20, 31, 0.95)",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "flex", alignContent: "center" }}>
                {gameData.platforms &&
                  gameData.platforms
                    .filter((platform) =>
                      validPlatforms.some((valid) => platform.startsWith(valid))
                    )
                    .map((platform, index) => {
                      const iconSrc = getPlatformIcon(platform);
                      if (!iconSrc) return null;

                      const platformType = validPlatforms.find((valid) =>
                        platform.startsWith(valid)
                      );
                      const alreadyAdded = gameData.platforms
                        .slice(0, index)
                        .some((p) => p.startsWith(platformType));

                      if (alreadyAdded) return null;

                      return (
                        <Image
                          key={`platform-${platform}-${index}`}
                          src={iconSrc}
                          alt={`${platform} Icon`}
                          width={20}
                          height={20}
                          style={{ marginRight: "8px", textAlign: "center" }}
                          unoptimized
                        />
                      );
                    })}
              </div>
              <h5
                style={{ margin: "10px 0", color: "white", fontSize: "15px" }}
              >
                <strong>{gameData.name}</strong>
              </h5>
              <p style={{ margin: "5px 0", color: "white" }}>
                Price: {gameData.price || "Price unavailable"}
              </p>
              <p style={{ margin: "5px 0", color: "white" }}>
                Genres: {gameData.genres?.join(", ") || "N/A"}
              </p>
              <p style={{ margin: "5px 0", color: "white" }}>
                Release Date: {gameData.first_release_date || "Unknown"}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "10px",
                  fontSize: "13px",
                }}
              >
                {gameData.websites &&
                  gameData.websites.map((website, index) => {
                    let urlLabel = "";
                    if (website.id === 1) urlLabel = "View Offical Website";
                    else if (website.id === 13) urlLabel = "View Steam Link";
                    else if (website.id === 16)
                      urlLabel = "View Epic Games Link";
                    else urlLabel = "View GoG Link";

                    return (
                      <p key={index} style={{ marginRight: "5px" }}>
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#bf94ff" }}
                          className="hover:underline"
                        >
                          {urlLabel}
                        </a>
                      </p>
                    );
                  })}

                {(!gameData.websites || gameData.websites.length === 0) &&
                  appId && (
                    <p>
                      <a
                        href={`https://store.steampowered.com/app/${appId}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#bf94ff" }}
                      >
                        View Steam Link
                      </a>
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
