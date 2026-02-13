import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimeData } from "../services/api";

interface ClubData {
  mal_id: number;
  name: string;
  url: string;
  images: { jpg: { image_url: string } };
  members: number;
  category: string;
  created: string;
  access: string;
}

const ClubsPage = () => {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("anime");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "anime",
    "manga",
    "actors_and_artists",
    "characters",
    "cities_and_neighborhoods",
    "companies",
    "conventions",
    "games",
    "japan",
    "music",
    "other",
    "schools",
  ];

  useEffect(() => {
    fetchClubs();
  }, [page, category]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/clubs?page=${page}&limit=24&order_by=members&sort=desc&category=${category}`,
      );
      const result = await response.json();

      if (page === 1) {
        setClubs(result.data || []);
      } else {
        setClubs((prev) => [...prev, ...(result.data || [])]);
      }
      setHasMore(result.pagination?.has_next_page || false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Anime Clubs 🎭
          </h1>
          <p className="text-dark/60">Join communities of anime & manga fans</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-white rounded-xl border border-cream-300 focus:border-primary outline-none"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white rounded-xl border border-cream-300 focus:border-primary outline-none capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <a
              key={club.mal_id}
              href={club.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/50 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="flex gap-4">
                <img
                  src={club.images.jpg.image_url || "/images/placeholder.jpg"}
                  alt={club.name}
                  className="w-16 h-16 rounded-lg object-cover bg-cream-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark line-clamp-1">
                    {club.name}
                  </h3>
                  <p className="text-sm text-primary">
                    {club.members.toLocaleString()} members
                  </p>
                  <p className="text-xs text-dark/50 capitalize">
                    {club.category.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </a>
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
              Load More Clubs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
