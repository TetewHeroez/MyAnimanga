import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Studio {
  mal_id: number;
  name: string;
  count: number;
}

// Popular studios with their MAL IDs
const POPULAR_STUDIOS: Studio[] = [
  { mal_id: 1, name: "Pierrot", count: 276 },
  { mal_id: 2, name: "Kyoto Animation", count: 89 },
  { mal_id: 4, name: "Bones", count: 145 },
  { mal_id: 6, name: "Gainax", count: 56 },
  { mal_id: 7, name: "J.C.Staff", count: 312 },
  { mal_id: 10, name: "Production I.G", count: 188 },
  { mal_id: 11, name: "Madhouse", count: 321 },
  { mal_id: 14, name: "Sunrise", count: 398 },
  { mal_id: 18, name: "Toei Animation", count: 567 },
  { mal_id: 21, name: "Studio Ghibli", count: 24 },
  { mal_id: 34, name: "Hal Film Maker", count: 32 },
  { mal_id: 43, name: "ufotable", count: 51 },
  { mal_id: 44, name: "Shaft", count: 85 },
  { mal_id: 56, name: "A-1 Pictures", count: 189 },
  { mal_id: 95, name: "Doga Kobo", count: 67 },
  { mal_id: 162, name: "OLM", count: 178 },
  { mal_id: 287, name: "David Production", count: 42 },
  { mal_id: 314, name: "White Fox", count: 38 },
  { mal_id: 456, name: "Trigger", count: 31 },
  { mal_id: 569, name: "MAPPA", count: 67 },
  { mal_id: 858, name: "Wit Studio", count: 28 },
  { mal_id: 1835, name: "CloverWorks", count: 35 },
];

const StudiosPage = () => {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedStudio) {
      fetchStudioAnime(selectedStudio.mal_id);
    }
  }, [selectedStudio]);

  const fetchStudioAnime = async (producerId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?producers=${producerId}&order_by=score&sort=desc&limit=24`,
      );
      const result = await response.json();
      setAnimeList(result.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudios = POPULAR_STUDIOS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Anime Studios 🎬
          </h1>
          <p className="text-dark/60">Browse anime by production studio</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search studios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-white rounded-xl border border-cream-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        {/* Studios Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {filteredStudios.map((studio) => (
            <button
              key={studio.mal_id}
              onClick={() => setSelectedStudio(studio)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedStudio?.mal_id === studio.mal_id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white/50 hover:bg-white hover:shadow-md"
              }`}
            >
              <p
                className={`font-semibold text-sm ${selectedStudio?.mal_id === studio.mal_id ? "text-white" : "text-dark"}`}
              >
                {studio.name}
              </p>
              <p
                className={`text-xs mt-1 ${selectedStudio?.mal_id === studio.mal_id ? "text-white/70" : "text-dark/50"}`}
              >
                {studio.count}+ anime
              </p>
            </button>
          ))}
        </div>

        {/* Selected Studio Anime */}
        {selectedStudio && (
          <div className="bg-white/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-dark mb-6">
              {selectedStudio.name} Anime
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {animeList.map((anime) => (
                  <Link
                    key={anime.mal_id}
                    to={`/anime/${anime.mal_id}`}
                    className="group"
                  >
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-cream-200">
                      <img
                        src={anime.images?.jpg?.large_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {anime.score && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded-lg">
                          ★ {anime.score}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                      {anime.title_english || anime.title}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedStudio && (
          <div className="text-center py-12 text-dark/50">
            <p className="text-lg">Select a studio to see their anime</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudiosPage;
