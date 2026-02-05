import { useState, useEffect } from "react";
import {
  getTopAnime,
  getAiringAnime,
  getSeasonalAnime,
  AnimeData,
} from "../services/api";
import AnimeCard from "../components/AnimeCard";
import { AnimeGridSkeleton } from "../components/Skeleton";

type FilterType = "popular" | "airing" | "seasonal";

const TrendingPage = () => {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("popular");

  useEffect(() => {
    async function fetchAnime() {
      setIsLoading(true);

      try {
        let data: AnimeData[] = [];

        switch (activeFilter) {
          case "popular":
            data = await getTopAnime(24);
            break;
          case "airing":
            data = await getAiringAnime(24);
            break;
          case "seasonal":
            data = await getSeasonalAnime(24);
            break;
        }

        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnime();
  }, [activeFilter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "popular", label: "Most Popular" },
    { key: "airing", label: "Currently Airing" },
    { key: "seasonal", label: "This Season" },
  ];

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Trending Anime
          </h1>
          <p className="text-dark/60">
            Discover the most popular and trending anime right now
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === filter.key
                  ? "bg-primary text-white"
                  : "bg-cream-300 text-dark hover:bg-cream-400"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <AnimeGridSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                showRank={activeFilter === "popular"}
                rank={activeFilter === "popular" ? index + 1 : undefined}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && animeList.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 mx-auto text-dark/30 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-dark/50">No anime found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
