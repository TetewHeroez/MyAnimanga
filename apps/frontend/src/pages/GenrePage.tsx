import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AnimeData } from "../services/api";
import { AnimeGridSkeleton } from "../components/Skeleton";

const GENRES = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" },
  { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" },
  { id: 14, name: "Horror" },
  { id: 7, name: "Mystery" },
  { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" },
  { id: 36, name: "Slice of Life" },
  { id: 30, name: "Sports" },
  { id: 37, name: "Supernatural" },
  { id: 41, name: "Thriller" },
];

async function getAnimeByGenre(
  genreId: number,
  limit: number = 24,
): Promise<AnimeData[]> {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=${limit}`,
    );
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    return [];
  }
}

const GenrePage = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [anime, setAnime] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const currentGenre = GENRES.find(
    (g) => g.id === (selectedGenre || parseInt(genreId || "1")),
  );

  useEffect(() => {
    const gId = selectedGenre || parseInt(genreId || "1");

    async function fetchAnime() {
      setIsLoading(true);
      const data = await getAnimeByGenre(gId, 24);
      setAnime(data);
      setIsLoading(false);
    }

    fetchAnime();
  }, [genreId, selectedGenre]);

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Browse by Genre
          </h1>
          <p className="text-dark/60">Discover anime by your favorite genres</p>
        </div>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (selectedGenre || parseInt(genreId || "1")) === genre.id
                  ? "bg-primary text-white"
                  : "bg-white/50 text-dark/70 hover:bg-white"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Current Genre Title */}
        <h2 className="text-2xl font-bold text-dark mb-6">
          {currentGenre?.name} Anime
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
                  {item.type} {item.year && `• ${item.year}`}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && anime.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark/60">No anime found for this genre</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
