import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchAnime, AnimeData } from "../services/api";

interface SearchDropdownProps {
  variant?: "light" | "dark";
}

const SearchDropdown = ({ variant = "dark" }: SearchDropdownProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchAnime(query, 8);
      setResults(data);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigate(`/anime/${results[selectedIndex].mal_id}`);
          setQuery("");
          setIsOpen(false);
        } else if (query.trim()) {
          navigate(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = () => {
    setQuery("");
    setIsOpen(false);
  };

  const isLight = variant === "light";

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          isLight
            ? "bg-white/10 border-white/30 focus-within:bg-white/20 focus-within:border-white/50"
            : "bg-cream-100 border-cream-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        }`}
      >
        <svg
          className={`w-4 h-4 shrink-0 ${isLight ? "text-white/70" : "text-dark/50"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search anime..."
          className={`w-32 lg:w-40 xl:w-48 bg-transparent text-sm outline-none placeholder:opacity-60 ${
            isLight
              ? "text-white placeholder:text-white/60"
              : "text-dark placeholder:text-dark/50"
          }`}
        />
        {isLoading && (
          <div
            className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
              isLight ? "border-white/50" : "border-primary"
            }`}
          />
        )}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className={`p-0.5 rounded-full transition-colors ${
              isLight
                ? "hover:bg-white/20 text-white/70"
                : "hover:bg-cream-200 text-dark/50"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 w-72 lg:w-80 bg-cream rounded-xl shadow-2xl border border-cream-300 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading && results.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Anime Section Header */}
              <div className="px-3 py-2 bg-primary/10 border-b border-cream-300">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Anime
                </span>
              </div>

              {/* Results List */}
              <div className="max-h-80 overflow-y-auto">
                {results.map((anime, index) => (
                  <Link
                    key={anime.mal_id}
                    to={`/anime/${anime.mal_id}`}
                    onClick={handleResultClick}
                    className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                      selectedIndex === index
                        ? "bg-primary/10"
                        : "hover:bg-cream-100"
                    }`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={
                        anime.images?.jpg?.small_image_url ||
                        anime.images?.jpg?.image_url
                      }
                      alt={anime.title}
                      className="w-10 h-14 object-cover rounded shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-dark truncate">
                        {anime.title}
                      </h4>
                      <p className="text-xs text-dark/60">
                        {anime.type || "TV"}
                        {anime.year
                          ? `, ${anime.year}`
                          : anime.aired?.prop?.from?.year
                            ? `, ${anime.aired.prop.from.year}`
                            : ""}
                      </p>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to list logic here
                      }}
                      className="shrink-0 text-xs text-primary hover:text-primary-600 font-medium opacity-0 group-hover:opacity-100"
                    >
                      add
                    </button>
                  </Link>
                ))}
              </div>

              {/* View All Link */}
              <Link
                to={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleResultClick}
                className="block px-3 py-2.5 text-center text-sm text-primary hover:bg-primary/5 border-t border-cream-300 font-medium"
              >
                View all results for <span className="font-bold">{query}</span>
              </Link>
            </>
          ) : query.trim().length >= 2 && !isLoading ? (
            <div className="py-8 text-center">
              <p className="text-dark/60 text-sm">
                No results found for "{query}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
