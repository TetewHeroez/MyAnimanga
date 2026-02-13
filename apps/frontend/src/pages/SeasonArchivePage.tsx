import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimeData } from "../services/api";
import { AnimeGridSkeleton } from "../components/Skeleton";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = (typeof SEASONS)[number];

async function getSeasonArchive(
  year: number,
  season: Season,
  limit: number = 24,
): Promise<AnimeData[]> {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/seasons/${year}/${season}?limit=${limit}`,
    );
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching season archive:", error);
    return [];
  }
}

const SeasonArchivePage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSeason, setSelectedSeason] = useState<Season>("winter");
  const [anime, setAnime] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate years from 2000 to current year
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i,
  );

  useEffect(() => {
    async function fetchAnime() {
      setIsLoading(true);
      const data = await getSeasonArchive(selectedYear, selectedSeason, 24);
      setAnime(data);
      setIsLoading(false);
    }

    fetchAnime();
  }, [selectedYear, selectedSeason]);

  const seasonColors: Record<Season, string> = {
    winter: "bg-blue-100 text-blue-700",
    spring: "bg-pink-100 text-pink-700",
    summer: "bg-yellow-100 text-yellow-700",
    fall: "bg-orange-100 text-orange-700",
  };

  const seasonEmojis: Record<Season, string> = {
    winter: "❄️",
    spring: "🌸",
    summer: "☀️",
    fall: "🍂",
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Season Archive
          </h1>
          <p className="text-dark/60">Explore anime by season and year</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-3 bg-white rounded-xl border border-cream-300 text-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Season Buttons */}
          <div className="flex gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors capitalize ${
                  selectedSeason === season
                    ? seasonColors[season]
                    : "bg-white/50 text-dark/70 hover:bg-white"
                }`}
              >
                {seasonEmojis[season]} {season}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-dark mb-6">
          {seasonEmojis[selectedSeason]}{" "}
          {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}{" "}
          {selectedYear}
        </h2>

        {/* Results */}
        {isLoading ? (
          <AnimeGridSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {anime.map((item) => (
              <Link
                key={item.mal_id}
                to={`/anime/${item.mal_id}`}
                className="group"
              >
                <div className="aspect-3/4 rounded-xl overflow-hidden bg-accent-gray mb-2 relative">
                  <img
                    src={item.images.jpg.large_image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.score && (
                    <div className="absolute top-2 right-2 bg-dark/80 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ⭐ {item.score}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title_english || item.title}
                </h3>
                <p className="text-xs text-dark/60">
                  {item.type} {item.episodes && `• ${item.episodes} eps`}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && anime.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark/60">No anime found for this season</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonArchivePage;
