import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimeData } from "../services/api";

const UpcomingPage = () => {
  const [anime, setAnime] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, [page]);

  const fetchUpcoming = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/seasons/upcoming?page=${page}&limit=24`,
      );
      const result = await response.json();

      if (page === 1) {
        setAnime(result.data || []);
      } else {
        setAnime((prev) => [...prev, ...(result.data || [])]);
      }
      setHasMore(result.pagination?.has_next_page || false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBA";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Upcoming Anime 🚀
          </h1>
          <p className="text-dark/60">Anime coming soon - get hyped!</p>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
          {anime.map((item) => (
            <Link
              key={item.mal_id}
              to={`/anime/${item.mal_id}`}
              className="group"
            >
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-cream-200 shadow-md">
                <img
                  src={item.images.jpg.large_image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Hype indicator based on members */}
                {item.members && item.members > 50000 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg animate-pulse">
                    🔥 HYPE
                  </div>
                )}
                {/* Release info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent p-3 pt-8">
                  <p className="text-white text-xs">
                    {item.season && item.year
                      ? `${item.season} ${item.year}`
                      : formatDate(item.aired?.from || null)}
                  </p>
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                {item.title_english || item.title}
              </h3>
              <p className="text-xs text-dark/50 mt-1">
                {item.type} • {item.episodes ? `${item.episodes} eps` : "TBA"}
              </p>
              {item.members && (
                <p className="text-xs text-primary mt-1">
                  👥 {item.members.toLocaleString()} waiting
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Load More */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingPage;
