import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface WatchlistAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: { jpg: { large_image_url: string } };
  score: number | null;
  episodes: number | null;
  status: string;
  broadcast?: { string: string };
  aired?: { from: string };
}

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"score" | "title" | "episodes">("score");

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      // Fetch popular currently airing anime as a "recommended watchlist"
      const response = await fetch(
        "https://api.jikan.moe/v4/seasons/now?filter=tv&order_by=score&sort=desc&limit=24",
      );
      const result = await response.json();
      setWatchlist(result.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedList = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return (b.score || 0) - (a.score || 0);
      case "title":
        return (a.title_english || a.title).localeCompare(
          b.title_english || b.title,
        );
      case "episodes":
        return (b.episodes || 0) - (a.episodes || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            What to Watch 📺
          </h1>
          <p className="text-dark/60">Top anime currently airing this season</p>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 mb-8">
          <span className="text-dark/60 self-center mr-2">Sort by:</span>
          {(["score", "title", "episodes"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                sortBy === option
                  ? "bg-primary text-white"
                  : "bg-white/50 text-dark hover:bg-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedList.map((anime, index) => (
              <Link
                key={anime.mal_id}
                to={`/anime/${anime.mal_id}`}
                className="bg-white/50 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="flex gap-4 p-4">
                  {/* Poster */}
                  <div className="relative w-24 flex-shrink-0">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full aspect-3/4 object-cover rounded-lg"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-dark/80 text-white text-xs font-bold rounded">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark group-hover:text-primary transition-colors line-clamp-2">
                      {anime.title_english || anime.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      {anime.score && (
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded-lg">
                          ★ {anime.score}
                        </span>
                      )}
                      {anime.episodes && (
                        <span className="text-xs text-dark/60">
                          {anime.episodes} eps
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-dark/50 mt-2 line-clamp-1">
                      {anime.broadcast?.string || "Airing now"}
                    </p>

                    <div className="mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          anime.status === "Currently Airing"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {anime.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
