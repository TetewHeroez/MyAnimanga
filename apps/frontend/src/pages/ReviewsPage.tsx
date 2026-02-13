import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Review {
  mal_id: number;
  type: string;
  reactions: {
    overall: number;
    nice: number;
    love_it: number;
    funny: number;
  };
  date: string;
  review: string;
  score: number;
  tags: string[];
  user: {
    username: string;
    images: { jpg: { image_url: string } };
  };
  entry: {
    mal_id: number;
    title: string;
    images: { jpg: { large_image_url: string } };
  };
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"anime" | "manga">("anime");
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    fetchReviews();
  }, [page, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/reviews/${filter}?page=${page}`,
      );
      const result = await response.json();

      if (page === 1) {
        setReviews(result.data || []);
      } else {
        setReviews((prev) => [...prev, ...(result.data || [])]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    if (score >= 4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Latest Reviews ✍️
          </h1>
          <p className="text-dark/60">Recent user reviews from the community</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => {
              setFilter("anime");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === "anime"
                ? "bg-primary text-white"
                : "bg-white/50 text-dark hover:bg-white"
            }`}
          >
            Anime Reviews
          </button>
          <button
            onClick={() => {
              setFilter("manga");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === "manga"
                ? "bg-primary text-white"
                : "bg-white/50 text-dark hover:bg-white"
            }`}
          >
            Manga Reviews
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.mal_id}
              className="bg-white/50 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start gap-4 p-6 pb-0">
                {/* Anime/Manga Cover */}
                <Link
                  to={
                    filter === "anime"
                      ? `/anime/${review.entry.mal_id}`
                      : `/manga/${review.entry.mal_id}`
                  }
                  className="flex-shrink-0"
                >
                  <img
                    src={review.entry.images.jpg.large_image_url}
                    alt={review.entry.title}
                    className="w-20 h-28 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={
                      filter === "anime"
                        ? `/anime/${review.entry.mal_id}`
                        : `/manga/${review.entry.mal_id}`
                    }
                    className="font-bold text-dark hover:text-primary transition-colors line-clamp-1"
                  >
                    {review.entry.title}
                  </Link>

                  {/* User & Score */}
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={review.user.images.jpg.image_url}
                      alt={review.user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-dark">
                      {review.user.username}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm font-bold ${getScoreColor(review.score)}`}
                    >
                      {review.score}/10
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {review.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-cream-300 rounded text-xs text-dark/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="p-6 pt-4">
                <p
                  className={`text-dark/80 text-sm leading-relaxed ${!expandedReviews.has(review.mal_id) ? "line-clamp-4" : ""}`}
                >
                  {review.review}
                </p>

                {review.review.length > 400 && (
                  <button
                    onClick={() => toggleExpand(review.mal_id)}
                    className="text-primary text-sm font-medium mt-2 hover:underline"
                  >
                    {expandedReviews.has(review.mal_id)
                      ? "Show Less"
                      : "Read More"}
                  </button>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-cream-300">
                  <span className="text-sm text-dark/60">
                    👍 {review.reactions.nice}
                  </span>
                  <span className="text-sm text-dark/60">
                    ❤️ {review.reactions.love_it}
                  </span>
                  <span className="text-sm text-dark/60">
                    😂 {review.reactions.funny}
                  </span>
                  <span className="text-xs text-dark/40 ml-auto">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
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
        {!loading && reviews.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
