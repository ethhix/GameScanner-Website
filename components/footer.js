import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1a1523] text-white py-8">
      <div className="container mx-auto px-20">
        <div className="flex flex-col gap-y-6 md:flex-row flex-wrap justify-center items-start">
          <div className="md:flex-1 md:max-w-[300px] text-center mx-auto">
            <h3 className="jersey-20-regular text-2xl font-bold mb-2 underline">
              GameScanner
            </h3>
            <p className="text-gray-300 text-base mb-2">
              Enhance your Twitch viewing experience with instant game
              information.
            </p>
            <div className="flex space-x-4 mt-2 justify-center">
              <a
                href="https://github.com/ethhix/GameScanner"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5 text-gray-300 hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://chrome.google.com/webstore/detail/bhmmmhohnnccohmpdhhgpimchaiagddc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chrome Web Store"
              >
                <svg
                  className="w-5 h-5 text-gray-300 hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:flex-1 md:max-w-[300px] text-center mx-auto">
            <h3 className="jersey-20-regular text-2xl font-bold mb-2 underline">
              Links
            </h3>
            <ul style={{ listStyle: "none" }} className="space-y-1 text-base">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:flex-1 md:max-w-[300px] text-center mx-auto">
            <h3 className="jersey-20-regular text-2xl font-bold mb-2 underline">
              Contact
            </h3>
            <p className="text-gray-300 text-base mb-1">
              Have questions or feedback?
            </p>
            <a
              href="mailto:gamescannercontact@gmail.com"
              className="text-purple-400 hover:text-white text-sm"
            >
              gamescannercontact@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-3 text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} GameScanner. All rights reserved.
            Not affiliated with Twitch.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
