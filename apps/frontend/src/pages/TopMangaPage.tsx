import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MangaData } from "../services/api";

type MangaType =
  | "manga"
  | "manhwa"
  | "manhua"
  | "novel"
  | "lightnovel"
  | "oneshot";
type FilterType = "all" | MangaType;

const TopMangaPage = () => {
  const [manga, setManga] = useState<MangaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchManga();
  }, [page, filter]);

  const fetchManga = async () => {
    setLoading(true);
    try {
      let url = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=24`;
      if (filter !== "all") {
        url += `&type=${filter}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (page === 1) {
        setManga(result.data || []);
      } else {
        setManga((prev) => [...prev, ...(result.data || [])]);
      }
      setHasMore(result.pagination?.has_next_page || false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "manga", label: "Manga" },
    { key: "manhwa", label: "Manhwa" },
    { key: "manhua", label: "Manhua" },
    { key: "lightnovel", label: "Light Novel" },
    { key: "novel", label: "Novel" },
    { key: "oneshot", label: "One-shot" },
  ];

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Top Manga 📚
          </h1>
          <p className="text-dark/60">Highest rated manga of all time</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-white/50 text-dark hover:bg-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
          {manga.map((item, index) => (
            <Link
              key={item.mal_id}
              to={`/manga/${item.mal_id}`}
              className="group"
            >
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-cream-200 shadow-md">
                <img
                  src={item.images.jpg.large_image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rank */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-dark/80 text-white text-xs font-bold rounded-lg">
                  #{(page - 1) * 24 + index + 1}
                </div>
                {/* Score */}
                {item.score && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs font-bold rounded-lg">
                    ★ {item.score}
                  </div>
                )}
                {/* Type Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 text-dark text-xs rounded-lg capitalize">
                  {item.type}
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                {item.title_english || item.title}
              </h3>
              <p className="text-xs text-dark/50 mt-1">
                {item.chapters
                  ? `${item.chapters} chapters`
                  : item.volumes
                    ? `${item.volumes} volumes`
                    : item.status}
              </p>
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

export default TopMangaPage;
