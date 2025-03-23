import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="container py-16 px-4 md:px-6 flex justify-center">
        <div className="mx-auto max-w-3xl w-full">
          <div className="pb-8 pt-8 md:pt-12 xl:pb-10 2xl:pb-12 border-b mb-8 text-center">
            <div className="flex flex-col space-y-2 lg:space-y-4">
              <h1 className="jersey-20-regular font-heading text-5xl md:text-4xl font-bold tracking-tighter dark:text-white xl:text-5xl">
                Privacy Policy
              </h1>
              <h2 className="jersey-20-regular text-lg tracking-tight text-muted-foreground 2xl:text-2xl">
                Last updated: March 19, 2025
              </h2>
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-10 border-l-4 border-green-500">
              <p className="text-lg mb-0 text-center">
                <strong>No data is collected, stored, or shared.</strong> This
                extension works entirely in your browser with no servers,
                accounts, or tracking.
              </p>
            </div>

            <section className="mb-10">
              <h2 className="jersey-20-regular text-3xl font-semibold tracking-tight mb-4">
                1. How It Works
              </h2>
              <ul className="space-y-3 list-disc pl-6">
                <li>Reads public Twitch category names to display game info</li>
                <li>Temporarily shows prices from official stores</li>
                <li>All processing happens in your browser tab</li>
                <li>Zero data persists after page refresh/close</li>
              </ul>
            </section>

            <section className="mb-10 bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
              <h2 className="jersey-20-regular text-3xl font-semibold tracking-tight mb-4">
                2. Third-Party Services
              </h2>
              <p className="mb-4">When viewing links, you're using:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Twitch", "https://www.twitch.tv/p/legal/privacy-policy/"],
                  [
                    "Steam",
                    "https://store.steampowered.com/privacy_agreement/",
                  ],
                  ["Epic Games", "https://www.epicgames.com/site/privacy"],
                  [
                    "GOG",
                    "https://support.gog.com/hc/en-us/articles/212632109-Privacy-Policy",
                  ],
                ].map(([name, url]) => (
                  <Link
                    key={name}
                    href={url}
                    className="flex items-center justify-center p-3 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {name} Privacy Policy
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="jersey-20-regular text-3xl font-semibold tracking-tight mb-4">
                3. Key Points
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/50">
                  <h3 className="font-semibold mb-2">No Tracking</h3>
                  <p className="mb-0">No cookies, analytics, or fingerprints</p>
                </div>

                <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/50">
                  <h3 className="font-semibold mb-2">Browser Only</h3>
                  <p className="mb-0">
                    Works locally - no data leaves your device
                  </p>
                </div>

                <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/50">
                  <h3 className="font-semibold mb-2">No Access To</h3>
                  <ul className="list-disc pl-6 mb-0">
                    <li>Your Twitch login</li>
                    <li>Payment details</li>
                    <li>Viewing history</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="jersey-20-regular text-3xl font-semibold tracking-tight mb-4">
                4. Your Control
              </h2>
              <div className="flex flex-col gap-4 md:flex-row md:justify-around">
                <div className="text-center p-4 rounded-lg border transition-colors duration-300 ease-in-out hover:bg-purple-900/50">
                  <p className="font-semibold mb-2">🔄 Uninstall Anytime</p>
                  <p className="text-sm mb-0">Remove via Chrome settings</p>
                </div>
                <div className="text-center p-4 rounded-lg border transition-colors duration-300 ease-in-out hover:bg-purple-900/50">
                  {" "}
                  <p className="font-semibold mb-2">📧 Contact</p>
                  <Link
                    href="mailto:gamescannercontact@gmail.com"
                    className="text-blue-600 dark:text-blue-400 underline text-sm"
                  >
                    gamescannercontact@gmail.com
                  </Link>
                </div>
              </div>
            </section>

            <section className="text-sm text-muted-foreground mt-12 border-t pt-6">
              <p>
                This policy meets requirements for:
                <br />
                <span className="inline-block mt-2 space-x-4">
                  <span>Chrome Web Store</span>
                  <span>•</span>
                  <span>Twitch API</span>
                  <span>•</span>
                  <span>GDPR/CCPA</span>
                </span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
