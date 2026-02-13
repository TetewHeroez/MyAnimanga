import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getAnimeById,
  AnimeData,
  checkInList,
  addToList,
  removeFromListByMalId,
  getAuthToken,
} from "../services/api";
import { Skeleton } from "../components/Skeleton";

// Extended anime data with trailer
interface AnimeDetailData extends AnimeData {
  trailer?: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  studios?: { mal_id: number; name: string }[];
  producers?: { mal_id: number; name: string }[];
  duration?: string;
  source?: string;
}

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInList, setIsInList] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [listItemId, setListItemId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  useEffect(() => {
    async function fetchAnime() {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch full details directly from Jikan for trailer info
        const response = await fetch(
          `https://api.jikan.moe/v4/anime/${id}/full`,
        );
        const result = await response.json();

        if (result.data) {
          setAnime(result.data);
          // Check if in list (backend)
          if (getAuthToken()) {
            const listCheck = await checkInList(result.data.mal_id, "anime");
            setIsInList(listCheck.inList);
            if (listCheck.data) {
              setListItemId(listCheck.data.id);
            }
          }
        } else {
          setError("Anime not found");
        }
      } catch (err) {
        setError("Failed to load anime details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnime();
  }, [id]);

  const handleAddToList = async (status: string = "plan_to_watch") => {
    if (!anime || !isLoggedIn) return;

    const result = await addToList({
      type: "anime",
      malId: anime.mal_id,
      title: anime.title,
      titleEnglish: anime.title_english || undefined,
      imageUrl: anime.images.jpg.large_image_url,
      status,
    });

    if (result) {
      setIsInList(true);
      setListItemId(result.id);
    }
  };

  const handleRemoveFromList = async () => {
    if (!anime || !isLoggedIn) return;

    const success = await removeFromListByMalId(anime.mal_id, "anime");
    if (success) {
      setIsInList(false);
      setListItemId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="aspect-3/4 rounded-2xl" />
            </div>
            {/* Info Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto text-center py-20">
          <svg
            className="w-20 h-20 mx-auto text-dark/30 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-dark mb-2">
            {error || "Anime not found"}
          </h1>
          <p className="text-dark/60 mb-6">
            The anime you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const title = anime.title_english || anime.title;

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url}
          alt={title}
          className="w-full h-full object-cover blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-cream via-cream/60 to-dark/40" />
      </div>

      {/* Content */}
      <div className="relative -mt-32 lg:-mt-48 px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={title}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-2xl shadow-2xl"
                />

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {!isLoggedIn ? (
                    <div className="text-center text-dark/60 text-sm py-3 bg-cream-200 rounded-xl">
                      Login to add to your list
                    </div>
                  ) : isInList ? (
                    <button
                      onClick={handleRemoveFromList}
                      className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
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
                      Remove from List
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToList("plan_to_watch")}
                      className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add to My List
                    </button>
                  )}

                  {anime.trailer?.youtube_id && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
                {title}
              </h1>
              {anime.title_japanese && (
                <p className="text-lg text-dark/60 mb-4">
                  {anime.title_japanese}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {anime.score && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold">{anime.score}</span>
                    {anime.scored_by && (
                      <span className="text-sm">
                        ({anime.scored_by.toLocaleString()} votes)
                      </span>
                    )}
                  </div>
                )}
                {anime.rank && (
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                    Ranked #{anime.rank}
                  </div>
                )}
                {anime.popularity && (
                  <div className="bg-cream-300 text-dark px-4 py-2 rounded-full font-semibold">
                    Popularity #{anime.popularity}
                  </div>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-dark/50 mb-1">Episodes</p>
                  <p className="font-bold text-dark">
                    {anime.episodes || "N/A"}
                  </p>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-dark/50 mb-1">Status</p>
                  <p className="font-bold text-dark">{anime.status || "N/A"}</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-dark/50 mb-1">Year</p>
                  <p className="font-bold text-dark">{anime.year || "N/A"}</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-dark/50 mb-1">Season</p>
                  <p className="font-bold text-dark capitalize">
                    {anime.season || "N/A"}
                  </p>
                </div>
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-dark mb-3">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              {anime.synopsis && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-dark mb-3">Synopsis</h2>
                  <p className="text-dark/70 leading-relaxed whitespace-pre-line">
                    {anime.synopsis}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white/50 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-dark mb-4">
                  Additional Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {anime.rating && (
                    <div className="flex justify-between">
                      <span className="text-dark/50">Rating</span>
                      <span className="font-medium text-dark">
                        {anime.rating}
                      </span>
                    </div>
                  )}
                  {anime.members && (
                    <div className="flex justify-between">
                      <span className="text-dark/50">Members</span>
                      <span className="font-medium text-dark">
                        {anime.members.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && anime?.trailer?.youtube_id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-cream transition-colors"
            >
              <svg
                className="w-8 h-8"
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
            <div className="aspect-video rounded-2xl overflow-hidden bg-dark">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}?autoplay=1`}
                title="Anime Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetailPage;
