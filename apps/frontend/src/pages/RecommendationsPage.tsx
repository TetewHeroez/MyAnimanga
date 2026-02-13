import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Recommendation {
  mal_id: string;
  entry: Array<{
    mal_id: number;
    title: string;
    images: { jpg: { large_image_url: string } };
  }>;
  content: string;
  user: { username: string };
}

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRecommendations();
  }, [page]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/recommendations/anime?page=${page}`,
      );
      const result = await response.json();

      if (page === 1) {
        setRecommendations(result.data || []);
      } else {
        setRecommendations((prev) => [...prev, ...(result.data || [])]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Anime Recommendations 💡
          </h1>
          <p className="text-dark/60">
            User recommendations - "If you liked X, you'll love Y"
          </p>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div
              key={`${rec.mal_id}-${index}`}
              className="bg-white/50 rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Anime Cards */}
                <div className="flex gap-4 items-center">
                  {/* First Anime */}
                  <Link
                    to={`/anime/${rec.entry[0]?.mal_id}`}
                    className="group flex-shrink-0"
                  >
                    <div className="w-24 lg:w-32 aspect-3/4 rounded-xl overflow-hidden bg-cream-200">
                      <img
                        src={rec.entry[0]?.images.jpg.large_image_url}
                        alt={rec.entry[0]?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-dark text-center line-clamp-2 w-24 lg:w-32 group-hover:text-primary">
                      {rec.entry[0]?.title}
                    </p>
                  </Link>

                  {/* Arrow */}
                  <div className="text-3xl text-primary">→</div>

                  {/* Second Anime */}
                  <Link
                    to={`/anime/${rec.entry[1]?.mal_id}`}
                    className="group flex-shrink-0"
                  >
                    <div className="w-24 lg:w-32 aspect-3/4 rounded-xl overflow-hidden bg-cream-200">
                      <img
                        src={rec.entry[1]?.images.jpg.large_image_url}
                        alt={rec.entry[1]?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-dark text-center line-clamp-2 w-24 lg:w-32 group-hover:text-primary">
                      {rec.entry[1]?.title}
                    </p>
                  </Link>
                </div>

                {/* Recommendation Text */}
                <div className="flex-1">
                  <p className="text-dark/80 text-sm leading-relaxed line-clamp-4">
                    "{rec.content}"
                  </p>
                  <p className="text-dark/50 text-xs mt-3">
                    — {rec.user.username}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Load More */}
        {!loading && recommendations.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Load More Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
