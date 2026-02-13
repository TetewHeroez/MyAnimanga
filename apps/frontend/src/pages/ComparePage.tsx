import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface CompareItem {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: { jpg: { large_image_url: string } };
  score: number | null;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  episodes: number | null;
  status: string;
  rating: string;
  genres: Array<{ mal_id: number; name: string }>;
  studios: Array<{ mal_id: number; name: string }>;
  year: number | null;
  season: string | null;
}

const ComparePage = () => {
  const [anime1, setAnime1] = useState<CompareItem | null>(null);
  const [anime2, setAnime2] = useState<CompareItem | null>(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [results1, setResults1] = useState<CompareItem[]>([]);
  const [results2, setResults2] = useState<CompareItem[]>([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const debounceRef1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchAnime = async (
    query: string,
    setResults: (r: CompareItem[]) => void,
  ) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`,
      );
      const result = await response.json();
      setResults(result.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (debounceRef1.current) clearTimeout(debounceRef1.current);
    debounceRef1.current = setTimeout(() => {
      searchAnime(search1, setResults1);
    }, 300);
    return () => {
      if (debounceRef1.current) clearTimeout(debounceRef1.current);
    };
  }, [search1]);

  useEffect(() => {
    if (debounceRef2.current) clearTimeout(debounceRef2.current);
    debounceRef2.current = setTimeout(() => {
      searchAnime(search2, setResults2);
    }, 300);
    return () => {
      if (debounceRef2.current) clearTimeout(debounceRef2.current);
    };
  }, [search2]);

  const selectAnime = (anime: CompareItem, slot: 1 | 2) => {
    if (slot === 1) {
      setAnime1(anime);
      setSearch1("");
      setResults1([]);
      setShowDropdown1(false);
    } else {
      setAnime2(anime);
      setSearch2("");
      setResults2([]);
      setShowDropdown2(false);
    }
  };

  const compareValue = (
    val1: number | null,
    val2: number | null,
    higherIsBetter: boolean = true,
  ) => {
    if (!val1 || !val2) return { class1: "", class2: "" };
    if (val1 === val2) return { class1: "text-dark", class2: "text-dark" };
    const better = higherIsBetter ? val1 > val2 : val1 < val2;
    return {
      class1: better ? "text-green-600 font-bold" : "text-red-500",
      class2: better ? "text-red-500" : "text-green-600 font-bold",
    };
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Compare Anime ⚔️
          </h1>
          <p className="text-dark/60">Compare two anime side by side</p>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Anime 1 Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-dark mb-2">
              First Anime
            </label>
            <input
              type="text"
              placeholder="Search anime..."
              value={search1}
              onChange={(e) => {
                setSearch1(e.target.value);
                setShowDropdown1(true);
              }}
              onFocus={() => setShowDropdown1(true)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300 focus:border-primary outline-none"
            />
            {showDropdown1 && results1.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden">
                {results1.map((anime) => (
                  <button
                    key={anime.mal_id}
                    onClick={() => selectAnime(anime, 1)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-cream-100 text-left"
                  >
                    <img
                      src={anime.images.jpg.large_image_url}
                      className="w-10 h-14 object-cover rounded"
                      alt=""
                    />
                    <span className="text-sm line-clamp-2">{anime.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Anime 2 Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-dark mb-2">
              Second Anime
            </label>
            <input
              type="text"
              placeholder="Search anime..."
              value={search2}
              onChange={(e) => {
                setSearch2(e.target.value);
                setShowDropdown2(true);
              }}
              onFocus={() => setShowDropdown2(true)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300 focus:border-primary outline-none"
            />
            {showDropdown2 && results2.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden">
                {results2.map((anime) => (
                  <button
                    key={anime.mal_id}
                    onClick={() => selectAnime(anime, 2)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-cream-100 text-left"
                  >
                    <img
                      src={anime.images.jpg.large_image_url}
                      className="w-10 h-14 object-cover rounded"
                      alt=""
                    />
                    <span className="text-sm line-clamp-2">{anime.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison */}
        {anime1 && anime2 ? (
          <div className="bg-white/50 rounded-2xl overflow-hidden">
            {/* Headers */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white/50">
              <Link
                to={`/anime/${anime1.mal_id}`}
                className="text-center group"
              >
                <img
                  src={anime1.images.jpg.large_image_url}
                  alt={anime1.title}
                  className="w-32 h-48 mx-auto object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                />
                <h3 className="mt-3 font-bold text-dark group-hover:text-primary transition-colors line-clamp-2">
                  {anime1.title_english || anime1.title}
                </h3>
              </Link>
              <div className="flex items-center justify-center">
                <span className="text-4xl">VS</span>
              </div>
              <Link
                to={`/anime/${anime2.mal_id}`}
                className="text-center group"
              >
                <img
                  src={anime2.images.jpg.large_image_url}
                  alt={anime2.title}
                  className="w-32 h-48 mx-auto object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                />
                <h3 className="mt-3 font-bold text-dark group-hover:text-primary transition-colors line-clamp-2">
                  {anime2.title_english || anime2.title}
                </h3>
              </Link>
            </div>

            {/* Stats */}
            <div className="divide-y divide-cream-200">
              {[
                {
                  label: "Score",
                  val1: anime1.score,
                  val2: anime2.score,
                  higher: true,
                },
                {
                  label: "Rank",
                  val1: anime1.rank,
                  val2: anime2.rank,
                  higher: false,
                },
                {
                  label: "Popularity",
                  val1: anime1.popularity,
                  val2: anime2.popularity,
                  higher: false,
                },
                {
                  label: "Members",
                  val1: anime1.members,
                  val2: anime2.members,
                  higher: true,
                },
                {
                  label: "Favorites",
                  val1: anime1.favorites,
                  val2: anime2.favorites,
                  higher: true,
                },
                {
                  label: "Episodes",
                  val1: anime1.episodes,
                  val2: anime2.episodes,
                  higher: true,
                },
              ].map(({ label, val1, val2, higher }) => {
                const { class1, class2 } = compareValue(val1, val2, higher);
                return (
                  <div key={label} className="grid grid-cols-3 gap-4 p-4">
                    <div className={`text-center ${class1}`}>
                      {val1
                        ? label === "Members" || label === "Favorites"
                          ? val1.toLocaleString()
                          : val1
                        : "N/A"}
                    </div>
                    <div className="text-center text-dark/60 font-medium">
                      {label}
                    </div>
                    <div className={`text-center ${class2}`}>
                      {val2
                        ? label === "Members" || label === "Favorites"
                          ? val2.toLocaleString()
                          : val2
                        : "N/A"}
                    </div>
                  </div>
                );
              })}

              {/* Genres */}
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {anime1.genres.slice(0, 4).map((g) => (
                      <span
                        key={g.mal_id}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-center text-dark/60 font-medium">
                  Genres
                </div>
                <div className="text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {anime2.genres.slice(0, 4).map((g) => (
                      <span
                        key={g.mal_id}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Studios */}
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-center text-sm text-dark">
                  {anime1.studios.map((s) => s.name).join(", ") || "Unknown"}
                </div>
                <div className="text-center text-dark/60 font-medium">
                  Studio
                </div>
                <div className="text-center text-sm text-dark">
                  {anime2.studios.map((s) => s.name).join(", ") || "Unknown"}
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-center text-sm text-dark">
                  {anime1.status}
                </div>
                <div className="text-center text-dark/60 font-medium">
                  Status
                </div>
                <div className="text-center text-sm text-dark">
                  {anime2.status}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/50 rounded-2xl p-12 text-center">
            <p className="text-dark/50 text-lg">Select two anime to compare</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
