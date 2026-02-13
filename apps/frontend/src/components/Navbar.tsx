import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import SearchDropdown from "./SearchDropdown";
import AuthModal from "./AuthModal";
import {
  getSavedUser,
  clearAuthData,
  verifyToken,
  type User,
} from "../services/api";

interface NavbarProps {
  transparent?: boolean;
  scrollThreshold?: "full" | "small";
}

const Navbar = ({
  transparent = false,
  scrollThreshold = "small",
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  // Check for logged in user and verify token
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = getSavedUser();
      if (savedUser) {
        // Verify token is still valid
        const result = await verifyToken();
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          // Token expired or invalid, clear data
          clearAuthData();
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      // For home page (full): scroll past 80% of viewport height
      // For detail pages (small): scroll past 100px
      const threshold =
        scrollThreshold === "full" ? window.innerHeight * 0.8 : 100;
      setIsScrolled(window.scrollY > threshold);
    };

    if (transparent) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [transparent, scrollThreshold]);

  const navBg =
    transparent && !isScrolled ? "bg-transparent" : "bg-cream shadow-sm";

  const textColor = transparent && !isScrolled ? "text-white" : "text-dark";

  const logoVariant = transparent && !isScrolled ? "light" : "dark";

  const loginBg =
    transparent && !isScrolled
      ? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
      : "bg-dark text-white hover:bg-gray-800";

  const dropdownBg =
    transparent && !isScrolled
      ? "bg-dark/90 backdrop-blur-md border border-white/10"
      : "bg-white border border-cream-200";

  const dropdownText = transparent && !isScrolled ? "text-white" : "text-dark";
  const dropdownHover =
    transparent && !isScrolled ? "hover:bg-white/10" : "hover:bg-cream-100";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full py-3 sm:py-4 px-4 sm:px-6 lg:px-8 xl:px-12 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="w-full flex items-center justify-between">
        {/* Logo */}
        <Logo variant={logoVariant} />

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <Link
            to="/"
            className={`font-semibold text-sm lg:text-base ${textColor} hover:opacity-70 transition-all duration-300`}
          >
            Home
          </Link>

          {/* Browse Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBrowseOpen(true)}
            onMouseLeave={() => setBrowseOpen(false)}
          >
            <button
              className={`font-semibold text-sm lg:text-base ${transparent && !isScrolled ? "text-white/90" : "text-primary"} hover:opacity-70 transition-all duration-300 flex items-center gap-1`}
            >
              Browse
              <svg
                className={`w-4 h-4 transition-transform ${browseOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {browseOpen && (
              <div
                className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl ${dropdownBg} p-3 z-50`}
              >
                <div className="grid grid-cols-1 gap-1">
                  <p
                    className={`text-xs font-bold uppercase ${dropdownText} opacity-50 px-3 py-2`}
                  >
                    Anime
                  </p>
                  <Link
                    to="/trending"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    🔥 Trending
                  </Link>
                  <Link
                    to="/seasons"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    📅 Seasons
                  </Link>
                  <Link
                    to="/upcoming"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    🚀 Upcoming
                  </Link>
                  <Link
                    to="/schedule"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    📆 Schedule
                  </Link>
                  <Link
                    to="/watchlist"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    📺 What to Watch
                  </Link>
                  <div className="h-px bg-current opacity-10 my-2" />
                  <p
                    className={`text-xs font-bold uppercase ${dropdownText} opacity-50 px-3 py-2`}
                  >
                    Manga
                  </p>
                  <Link
                    to="/top-manga"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    📚 Top Manga
                  </Link>
                  <div className="h-px bg-current opacity-10 my-2" />
                  <p
                    className={`text-xs font-bold uppercase ${dropdownText} opacity-50 px-3 py-2`}
                  >
                    Discover
                  </p>
                  <Link
                    to="/genre"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    🏷️ Genres
                  </Link>
                  <Link
                    to="/studios"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    🎬 Studios
                  </Link>
                  <Link
                    to="/characters"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    👤 Characters
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Community Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCommunityOpen(true)}
            onMouseLeave={() => setCommunityOpen(false)}
          >
            <button
              className={`font-semibold text-sm lg:text-base ${textColor} hover:opacity-70 transition-all duration-300 flex items-center gap-1`}
            >
              Community
              <svg
                className={`w-4 h-4 transition-transform ${communityOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {communityOpen && (
              <div
                className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-xl ${dropdownBg} p-3 z-50`}
              >
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    to="/recommendations"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    💡 Recommendations
                  </Link>
                  <Link
                    to="/reviews"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    ✍️ Reviews
                  </Link>
                  <Link
                    to="/forum"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    💬 Forum
                  </Link>
                  <Link
                    to="/clubs"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    🎭 Clubs
                  </Link>
                  <Link
                    to="/news"
                    className={`${dropdownText} ${dropdownHover} px-3 py-2 rounded-lg text-sm flex items-center gap-2`}
                  >
                    📰 News
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/compare"
            className={`font-semibold text-sm lg:text-base ${textColor} hover:opacity-70 transition-all duration-300`}
          >
            Compare
          </Link>
          <Link
            to="/quotes"
            className={`font-semibold text-sm lg:text-base ${textColor} hover:opacity-70 transition-all duration-300`}
          >
            Quotes
          </Link>
          <Link
            to="/random"
            className={`font-semibold text-sm lg:text-base ${transparent && !isScrolled ? "text-white/90" : "text-primary"} hover:opacity-70 transition-all duration-300`}
          >
            Random
          </Link>
        </div>

        {/* Right Side - Search & Login */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
          <SearchDropdown
            variant={transparent && !isScrolled ? "light" : "dark"}
          />
          {user ? (
            <div className="relative group">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${loginBg}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline font-medium">
                  {user.username}
                </span>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-cream rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-cream-200 rounded-t-xl"
                >
                  <span>👤</span> Profile
                </Link>
                <Link
                  to="/my-list"
                  className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-cream-200"
                >
                  <span>📋</span> My List
                </Link>
                <Link
                  to="/statistics"
                  className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-cream-200"
                >
                  <span>📊</span> Statistics
                </Link>
                <Link
                  to="/export-import"
                  className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-cream-200"
                >
                  <span>📦</span> Export / Import
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-dark hover:bg-cream-200"
                >
                  <span>⚙️</span> Settings
                </Link>
                <div className="h-px bg-cream-300 mx-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-cream-200 rounded-b-xl"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className={`px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 ${loginBg}`}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2 ${textColor} transition-colors duration-300`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-cream border-t border-cream-300 shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-1">
            <Link
              to="/"
              className="font-medium text-dark hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-cream-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>

            {/* Browse Section */}
            <div className="py-2 px-3">
              <p className="text-xs font-bold text-dark/50 uppercase mb-2">
                Browse
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/trending"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔥 Trending
                </Link>
                <Link
                  to="/seasons"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📅 Seasons
                </Link>
                <Link
                  to="/upcoming"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🚀 Upcoming
                </Link>
                <Link
                  to="/schedule"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📆 Schedule
                </Link>
                <Link
                  to="/top-manga"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📚 Top Manga
                </Link>
                <Link
                  to="/genre"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏷️ Genres
                </Link>
                <Link
                  to="/studios"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎬 Studios
                </Link>
                <Link
                  to="/characters"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Characters
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div className="py-2 px-3">
              <p className="text-xs font-bold text-dark/50 uppercase mb-2">
                Community
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/recommendations"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💡 Recommendations
                </Link>
                <Link
                  to="/reviews"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✍️ Reviews
                </Link>
                <Link
                  to="/forum"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💬 Forum
                </Link>
                <Link
                  to="/clubs"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎭 Clubs
                </Link>
                <Link
                  to="/news"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📰 News
                </Link>
                <Link
                  to="/quotes"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💬 Quotes
                </Link>
              </div>
            </div>

            {/* Tools Section */}
            <div className="py-2 px-3">
              <p className="text-xs font-bold text-dark/50 uppercase mb-2">
                Tools
              </p>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  to="/compare"
                  className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚔️ Compare
                </Link>
                <Link
                  to="/random"
                  className="text-sm text-primary font-medium py-2 px-2 rounded hover:bg-cream-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Random
                </Link>
              </div>
            </div>

            {user && (
              <div className="py-2 px-3 border-t border-cream-300">
                <p className="text-xs font-bold text-dark/50 uppercase mb-2">
                  My Account
                </p>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/profile"
                    className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/my-list"
                    className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📋 My List
                  </Link>
                  <Link
                    to="/statistics"
                    className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📊 Statistics
                  </Link>
                  <Link
                    to="/export-import"
                    className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📦 Export
                  </Link>
                  <Link
                    to="/settings"
                    className="text-sm text-dark hover:text-primary py-2 px-2 rounded hover:bg-cream-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ⚙️ Settings
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Search & Login */}
            <div className="flex flex-col gap-3 pt-3 border-t border-cream-300 sm:hidden">
              <SearchDropdown variant="dark" />
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  🚪 Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="flex-1 px-4 py-2 bg-dark text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </nav>
  );
};

export default Navbar;
