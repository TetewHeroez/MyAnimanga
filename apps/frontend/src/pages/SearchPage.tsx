import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  searchAnime,
  searchManga,
  AnimeData,
  MangaData,
} from "../services/api";
import { AnimeGridSkeleton } from "../components/Skeleton";

type SearchTab = "all" | "anime" | "manga";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [animeResults, setAnimeResults] = useState<AnimeData[]>([]);
  const [mangaResults, setMangaResults] = useState<MangaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");

  useEffect(() => {
    async function search() {
      if (!query) return;

      setIsLoading(true);

      const [anime, manga] = await Promise.all([
        searchAnime(query, 20),
        searchManga(query, 20),
      ]);

      setAnimeResults(anime);
      setMangaResults(manga);
      setIsLoading(false);
    }

    search();
  }, [query]);

  const tabs: { key: SearchTab; label: string; count: number }[] = [
    {
      key: "all",
      label: "All",
      count: animeResults.length + mangaResults.length,
    },
    { key: "anime", label: "Anime", count: animeResults.length },
    { key: "manga", label: "Manga", count: mangaResults.length },
  ];

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Search Results
          </h1>
          <p className="text-dark/60">
            Showing results for "
            <span className="font-semibold text-dark">{query}</span>"
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-white/50 text-dark/70 hover:bg-white"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {isLoading ? (
          <AnimeGridSkeleton count={12} />
        ) : (
          <>
            {/* Anime Results */}
            {(activeTab === "all" || activeTab === "anime") &&
              animeResults.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold text-dark mb-4">Anime</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {animeResults.map((anime) => (
                      <Link
                        key={anime.mal_id}
                        to={`/anime/${anime.mal_id}`}
                        className="group"
                      >
                        <div className="aspect-3/4 rounded-xl overflow-hidden bg-accent-gray mb-2">
                          <img
                            src={anime.images.jpg.large_image_url}
                            alt={anime.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                          {anime.title_english || anime.title}
                        </h3>
                        <p className="text-xs text-dark/60">
                          {anime.type} {anime.year && `• ${anime.year}`}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Manga Results */}
            {(activeTab === "all" || activeTab === "manga") &&
              mangaResults.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold text-dark mb-4">Manga</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {mangaResults.map((manga) => {
                      const linkPath =
                        manga.type === "Light Novel"
                          ? `/lightnovel/${manga.mal_id}`
                          : `/manga/${manga.mal_id}`;
                      return (
                        <Link
                          key={manga.mal_id}
                          to={linkPath}
                          className="group"
                        >
                          <div className="aspect-3/4 rounded-xl overflow-hidden bg-accent-gray mb-2">
                            <img
                              src={manga.images.jpg.large_image_url}
                              alt={manga.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <h3 className="text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                            {manga.title_english || manga.title}
                          </h3>
                          <p className="text-xs text-dark/60">{manga.type}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* No Results */}
            {animeResults.length === 0 && mangaResults.length === 0 && (
              <div className="text-center py-20">
                <svg
                  className="w-20 h-20 mx-auto text-dark/20 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-dark mb-2">
                  No results found
                </h2>
                <p className="text-dark/60">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
