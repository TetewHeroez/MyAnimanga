import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Character {
  mal_id: number;
  name: string;
  name_kanji: string | null;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
  favorites: number;
  about: string | null;
}

const CharactersPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/top/characters?page=${page}&limit=24`,
      );
      const result = await response.json();

      if (page === 1) {
        setCharacters(result.data || []);
      } else {
        setCharacters((prev) => [...prev, ...(result.data || [])]);
      }
      setHasMore(result.pagination?.has_next_page || false);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Top Characters 👤
          </h1>
          <p className="text-dark/60">
            Most favorited anime characters of all time
          </p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {characters.map((character, index) => (
            <Link
              key={character.mal_id}
              to={`/character/${character.mal_id}`}
              className="group"
            >
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-cream-200 shadow-md">
                <img
                  src={character.images.jpg.image_url}
                  alt={character.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rank Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs font-bold rounded-lg">
                  #{(page - 1) * 24 + index + 1}
                </div>
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm line-clamp-2">
                    {character.name}
                  </p>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-1">
                    ❤️ {character.favorites.toLocaleString()}
                  </p>
                </div>
              </div>
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
              Load More Characters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersPage;
