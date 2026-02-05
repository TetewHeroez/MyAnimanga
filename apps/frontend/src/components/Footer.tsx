import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-cream py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <div className="mb-4 pointer-events-none">
              <Logo variant="light" />
            </div>
            <p className="text-cream/80 text-xs sm:text-sm max-w-md mb-6">
              Your ultimate destination for tracking, discovering, and managing
              your anime journey. Never miss what's trending, new, or essential.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-cream/60 hover:text-cream transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
              Browse
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-cream/80">
              <li>
                <Link
                  to="/trending"
                  className="hover:text-cream transition-colors"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  to="/seasons"
                  className="hover:text-cream transition-colors"
                >
                  Seasons
                </Link>
              </li>
              <li>
                <Link
                  to="/upcoming"
                  className="hover:text-cream transition-colors"
                >
                  Upcoming
                </Link>
              </li>
              <li>
                <Link
                  to="/top-manga"
                  className="hover:text-cream transition-colors"
                >
                  Top Manga
                </Link>
              </li>
              <li>
                <Link
                  to="/genre"
                  className="hover:text-cream transition-colors"
                >
                  Genres
                </Link>
              </li>
              <li>
                <Link
                  to="/studios"
                  className="hover:text-cream transition-colors"
                >
                  Studios
                </Link>
              </li>
              <li>
                <Link
                  to="/characters"
                  className="hover:text-cream transition-colors"
                >
                  Characters
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
              Community
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-cream/80">
              <li>
                <Link
                  to="/recommendations"
                  className="hover:text-cream transition-colors"
                >
                  Recommendations
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-cream transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/forum"
                  className="hover:text-cream transition-colors"
                >
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  to="/clubs"
                  className="hover:text-cream transition-colors"
                >
                  Clubs
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-cream transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/quotes"
                  className="hover:text-cream transition-colors"
                >
                  Quotes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Tools & Account Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t border-cream/20">
          <div>
            <h4 className="font-bold mb-3 text-sm">Tools</h4>
            <ul className="space-y-1.5 text-xs text-cream/80">
              <li>
                <Link
                  to="/compare"
                  className="hover:text-cream transition-colors"
                >
                  Compare Anime
                </Link>
              </li>
              <li>
                <Link
                  to="/random"
                  className="hover:text-cream transition-colors"
                >
                  Random Anime
                </Link>
              </li>
              <li>
                <Link
                  to="/schedule"
                  className="hover:text-cream transition-colors"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  to="/watchlist"
                  className="hover:text-cream transition-colors"
                >
                  What to Watch
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm">Account</h4>
            <ul className="space-y-1.5 text-xs text-cream/80">
              <li>
                <Link
                  to="/profile"
                  className="hover:text-cream transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/my-list"
                  className="hover:text-cream transition-colors"
                >
                  My List
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className="hover:text-cream transition-colors"
                >
                  Statistics
                </Link>
              </li>
              <li>
                <Link
                  to="/export-import"
                  className="hover:text-cream transition-colors"
                >
                  Export / Import
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="hover:text-cream transition-colors"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm">Support</h4>
            <ul className="space-y-1.5 text-xs text-cream/80">
              <li>
                <a href="#" className="hover:text-cream transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cream transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm">API</h4>
            <ul className="space-y-1.5 text-xs text-cream/80">
              <li>
                <a
                  href="https://jikan.moe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  Jikan API
                </a>
              </li>
              <li>
                <a
                  href="https://myanimelist.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  MyAnimeList
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/30 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-cream/60">
          <p>© 2026 MyList Animanga. All rights reserved.</p>
          <p>
            Data provided by{" "}
            <a
              href="https://jikan.moe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream hover:underline"
            >
              Jikan API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
