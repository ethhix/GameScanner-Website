"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import GameHoverCard from "../components/GameHoverCard";
import ArrowSvg from "../public/assets/images/arrow.svg";

const Body = () => {
  const [currentStream, setCurrentStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const descriptionRef = useRef(null);

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

  useEffect(() => {
    fetchGameStream();

    const interval = setInterval(() => {
      if (currentStream) {
        checkStreamStatus(currentStream.user_login);
      }
    }, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
            overwrite: "auto",
          }
        );
      }
    };
    // Wait for content load and DOM stabilization
    setTimeout(animate, 500);
  }, []);

  const fetchGameStream = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/twitch?action=getStreams&limit=5");

      if (!response.ok) {
        throw new Error("Failed to fetch streams");
      }

      const data = await response.json();

      // Filter out non-game streams
      const gameStreams = data.data.filter(
        (stream) => !ignoreGameTitle.includes(stream.game_name)
      );

      if (gameStreams.length === 0) {
        throw new Error("No game streams available");
      }

      setCurrentStream(gameStreams[0]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const checkStreamStatus = async (username) => {
    try {
      const response = await fetch(
        `/api/twitch?action=checkStream&username=${username}`
      );

      if (!response.ok) {
        throw new Error("Failed to check stream");
      }

      const data = await response.json();

      if (
        data.data.length === 0 ||
        ignoreGameTitle.includes(data.data[0].game_name)
      ) {
        // Stream is offline or changed to non-game category
        fetchGameStream();
      }
    } catch (error) {
      console.error("Error checking stream:", error);
    }
  };

  if (loading) return <div className="text-center p-8">Loading stream...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!currentStream)
    return <div className="text-center p-8">No streams available</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 relative">
      <div className="text-center mb-6">
        <p className="jersey-10-regular text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Retrieve game data seamlessly without any interruptions to the
          stream!&nbsp;<u>Try it out below!</u>
        </p>
      </div>

      <div className="relative w-full aspect-video">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://player.twitch.tv/?channel=${currentStream.user_login}&parent=${window.location.hostname}`}
          allowFullScreen={false}
        ></iframe>
      </div>

      <div className="mt-4 max-w-fit">
        <h3 className="inter-regular text-xl font-bold">
          {currentStream.title}
        </h3>
        <div id="game-category" className="relative">
          <GameHoverCard gameName={currentStream.game_name} />
          <div
            className="absolute"
            style={{
              left: "-240px",
              top: "-210px",
              width: "200px",
              textAlign: "center",
              transform: "rotate(-5deg)",
              zIndex: 10,
            }}
          >
            <p
              ref={descriptionRef}
              className="description jersey-20-regular font-bold text-2xl"
              style={{
                transformOrigin: "center",
                display: "inline-block",
              }}
            >
              Hover over the game category to get details seamlessly!
            </p>
          </div>
          <div
            className="absolute z-[-1]"
            style={{
              left: "-420px",
              top: "-360px",
              transform: "rotate(-5deg)",
            }}
          >
            <Image src={ArrowSvg} alt="Curved arrow" width={650} height={700} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
