import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MangaData,
  checkInList,
  addToList,
  removeFromListByMalId,
  getAuthToken,
} from "../services/api";
import { Skeleton } from "../components/Skeleton";

// Get manga by ID directly
async function getMangaById(id: number): Promise<MangaData | null> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching manga by ID:", error);
    return null;
  }
}

const MangaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInList, setIsInList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  useEffect(() => {
    async function fetchManga() {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getMangaById(parseInt(id));
        if (data) {
          setManga(data);
          // Check if in list (backend)
          if (getAuthToken()) {
            const listType =
              data.type === "Light Novel" ? "lightnovel" : "manga";
            const listCheck = await checkInList(data.mal_id, listType);
            setIsInList(listCheck.inList);
          }
        } else {
          setError("Manga not found");
        }
      } catch (err) {
        setError("Failed to load manga details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchManga();
  }, [id]);

  const handleAddToList = async () => {
    if (!manga || !isLoggedIn) return;

    const listType = manga.type === "Light Novel" ? "lightnovel" : "manga";
    const result = await addToList({
      type: listType,
      malId: manga.mal_id,
      title: manga.title,
      titleEnglish: manga.title_english || undefined,
      imageUrl: manga.images.jpg.large_image_url,
      status: "plan_to_read",
    });

    if (result) {
      setIsInList(true);
    }
  };

  const handleRemoveFromList = async () => {
    if (!manga || !isLoggedIn) return;

    const listType = manga.type === "Light Novel" ? "lightnovel" : "manga";
    const success = await removeFromListByMalId(manga.mal_id, listType);
    if (success) {
      setIsInList(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="aspect-3/4 rounded-2xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-dark mb-2">
            {error || "Manga not found"}
          </h1>
          <Link to="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src={manga.images?.jpg?.large_image_url}
          alt={manga.title}
          className="w-full h-full object-cover blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-cream via-cream/60 to-dark/40" />
      </div>

      <div className="relative -mt-32 lg:-mt-48 px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <img
                  src={manga.images?.jpg?.large_image_url}
                  alt={manga.title}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-2xl shadow-2xl"
                />

                {/* Action Buttons */}
                <div className="mt-6 space-y-3 max-w-sm mx-auto">
                  {!isLoggedIn ? (
                    <div className="text-center text-dark/60 text-sm py-3 bg-cream-200 rounded-xl">
                      Login to add to your list
                    </div>
                  ) : isInList ? (
                    <button
                      onClick={handleRemoveFromList}
                      className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Remove from List
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToList}
                      className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Add to My List
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="bg-white/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {manga.score || "N/A"}
                    </p>
                    <p className="text-xs text-dark/60">Score</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-dark">
                      #{manga.rank || "N/A"}
                    </p>
                    <p className="text-xs text-dark/60">Ranked</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-dark">
                      {manga.chapters || "?"}
                    </p>
                    <p className="text-xs text-dark/60">Chapters</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-dark">
                      {manga.volumes || "?"}
                    </p>
                    <p className="text-xs text-dark/60">Volumes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
                {manga.title_english || manga.title}
              </h1>
              {manga.title_japanese && (
                <p className="text-lg text-dark/60 mb-4">
                  {manga.title_japanese}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {manga.type && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {manga.type}
                  </span>
                )}
                {manga.status && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {manga.status}
                  </span>
                )}
                {manga.genres?.map((genre: any) => (
                  <span
                    key={genre.mal_id}
                    className="px-3 py-1 bg-cream-300 text-dark/70 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-dark mb-3">Synopsis</h2>
                <p className="text-dark/70 leading-relaxed whitespace-pre-line">
                  {manga.synopsis || "No synopsis available."}
                </p>
              </div>

              {/* Information */}
              <div className="bg-white/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-dark mb-4">
                  Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-dark/60 text-sm">Type</p>
                    <p className="font-medium text-dark">
                      {manga.type || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark/60 text-sm">Status</p>
                    <p className="font-medium text-dark">
                      {manga.status || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark/60 text-sm">Chapters</p>
                    <p className="font-medium text-dark">
                      {manga.chapters || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark/60 text-sm">Volumes</p>
                    <p className="font-medium text-dark">
                      {manga.volumes || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark/60 text-sm">Published</p>
                    <p className="font-medium text-dark">
                      {manga.published?.string || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark/60 text-sm">Members</p>
                    <p className="font-medium text-dark">
                      {manga.members?.toLocaleString() || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Authors */}
              {manga.authors && manga.authors.length > 0 && (
                <div className="mt-6 bg-white/50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-dark mb-4">Authors</h2>
                  <div className="flex flex-wrap gap-2">
                    {manga.authors.map((author: any) => (
                      <span
                        key={author.mal_id}
                        className="px-3 py-1 bg-cream-300 rounded-full text-sm"
                      >
                        {author.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetailPage;
