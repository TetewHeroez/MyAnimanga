import { Link } from "react-router-dom";
import { AnimeData } from "../services/api";

interface AnimeCardProps {
  anime: AnimeData;
  variant?: "default" | "compact" | "large";
  showRank?: boolean;
  rank?: number;
}

const AnimeCard = ({
  anime,
  variant = "default",
  showRank = false,
  rank,
}: AnimeCardProps) => {
  const imageUrl =
    anime.images.jpg.large_image_url || anime.images.jpg.image_url;
  const title = anime.title_english || anime.title;

  if (variant === "compact") {
    return (
      <Link
        to={`/anime/${anime.mal_id}`}
        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-cream-200 transition-colors"
      >
        {showRank && rank && (
          <span className="w-8 text-center font-bold text-primary text-lg">
            {rank}
          </span>
        )}
        <img
          src={anime.images.jpg.small_image_url}
          alt={title}
          className="w-12 h-16 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-dark text-sm truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-dark/50">
            {anime.score && (
              <span className="flex items-center gap-0.5">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {anime.score}
              </span>
            )}
            {anime.episodes && <span>{anime.episodes} eps</span>}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link
        to={`/anime/${anime.mal_id}`}
        className="group relative overflow-hidden rounded-2xl aspect-[3/4] block"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

        {/* Rank Badge */}
        {showRank && rank && (
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            #{rank}
          </div>
        )}

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-3 right-3 bg-dark/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {anime.score}
          </div>
        )}

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg mb-1 line-clamp-2 group-hover:text-primary-200 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            {anime.episodes && <span>{anime.episodes} episodes</span>}
            {anime.status && <span>• {anime.status}</span>}
          </div>
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {anime.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/anime/${anime.mal_id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-3">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white px-4 py-2 rounded-full font-medium text-sm">
            View Details
          </span>
        </div>

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-2 right-2 bg-dark/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <svg
              className="w-3 h-3 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {anime.score}
          </div>
        )}

        {/* Rank Badge */}
        {showRank && rank && (
          <div className="absolute top-2 left-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {rank}
          </div>
        )}
      </div>

      <h3 className="font-semibold text-dark text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
        {title}
      </h3>
      <div className="flex items-center gap-2 text-xs text-dark/50">
        {anime.episodes && <span>{anime.episodes} eps</span>}
        {anime.year && <span>• {anime.year}</span>}
      </div>
    </Link>
  );
};

export default AnimeCard;
