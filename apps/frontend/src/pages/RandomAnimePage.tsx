import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimeData } from "../services/api";

async function getRandomAnime(): Promise<AnimeData | null> {
  try {
    const response = await fetch("https://api.jikan.moe/v4/random/anime");
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching random anime:", error);
    return null;
  }
}

const RandomAnimePage = () => {
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const fetchRandom = async () => {
    setIsLoading(true);
    const data = await getRandomAnime();
    setAnime(data);
    setIsLoading(false);
    setHasSearched(true);
  };

  const goToAnime = () => {
    if (anime) {
      navigate(`/anime/${anime.mal_id}`);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">
            🎲 Random Anime
          </h1>
          <p className="text-dark/60 text-lg">
            Can't decide what to watch? Let fate choose for you!
          </p>
        </div>

        {/* Roll Button */}
        {!hasSearched && (
          <button
            onClick={fetchRandom}
            disabled={isLoading}
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl text-xl font-bold hover:bg-primary-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Rolling...
              </>
            ) : (
              <>
                <span className="text-2xl">🎰</span>
                Roll the Dice!
              </>
            )}
          </button>
        )}

        {/* Loading */}
        {isLoading && hasSearched && (
          <div className="py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-dark/60">Finding your next anime...</p>
          </div>
        )}

        {/* Result */}
        {!isLoading && anime && (
          <div className="bg-white/50 rounded-3xl p-6 lg:p-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Poster */}
              <div className="shrink-0">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-48 h-auto rounded-xl shadow-lg mx-auto sm:mx-0"
                />
              </div>

              {/* Info */}
              <div className="text-left flex-1">
                <h2 className="text-2xl font-bold text-dark mb-2">
                  {anime.title_english || anime.title}
                </h2>
                {anime.title_japanese && (
                  <p className="text-dark/60 mb-3">{anime.title_japanese}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.type && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {anime.type}
                    </span>
                  )}
                  {anime.score && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⭐ {anime.score}
                    </span>
                  )}
                  {anime.episodes && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {anime.episodes} eps
                    </span>
                  )}
                </div>

                <p className="text-dark/70 text-sm line-clamp-4 mb-4">
                  {anime.synopsis || "No synopsis available."}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-2 py-1 bg-cream-300 rounded-full text-xs text-dark/70"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-cream-300">
              <button
                onClick={goToAnime}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={fetchRandom}
                disabled={isLoading}
                className="flex-1 py-3 bg-dark text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                🎲 Roll Again
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {hasSearched && !isLoading && (
          <div className="mt-8">
            <Link to="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomAnimePage;
