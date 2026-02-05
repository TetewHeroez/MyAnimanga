import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface NewsItem {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  forum_url: string;
  images: { jpg: { image_url: string } };
  comments: number;
  excerpt: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"anime" | "manga">("anime");

  useEffect(() => {
    fetchNews();
  }, [source]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Fetch news from popular anime's news (there's no general news endpoint)
      // Using top anime to get variety of news
      const topResponse = await fetch(
        `https://api.jikan.moe/v4/top/${source}?limit=5`,
      );
      const topResult = await topResponse.json();

      const newsPromises =
        topResult.data?.slice(0, 3).map(async (item: any) => {
          const newsRes = await fetch(
            `https://api.jikan.moe/v4/${source}/${item.mal_id}/news`,
          );
          const newsData = await newsRes.json();
          return newsData.data?.slice(0, 4) || [];
        }) || [];

      const allNews = (await Promise.all(newsPromises)).flat();
      // Sort by date
      allNews.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setNews(allNews);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Anime News 📰
          </h1>
          <p className="text-dark/60">
            Latest news and updates from the anime world
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSource("anime")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              source === "anime"
                ? "bg-primary text-white"
                : "bg-white/50 text-dark hover:bg-white"
            }`}
          >
            Anime News
          </button>
          <button
            onClick={() => setSource("manga")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              source === "manga"
                ? "bg-primary text-white"
                : "bg-white/50 text-dark hover:bg-white"
            }`}
          >
            Manga News
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item, index) => (
              <a
                key={`${item.mal_id}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/50 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  {item.images.jpg.image_url && (
                    <div className="sm:w-48 flex-shrink-0">
                      <img
                        src={item.images.jpg.image_url}
                        alt={item.title}
                        className="w-full h-40 sm:h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex-1">
                    <h2 className="font-bold text-dark group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-dark/70 line-clamp-3 mb-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-dark/50">
                      <span>by {item.author_username}</span>
                      <div className="flex items-center gap-4">
                        <span>💬 {item.comments}</span>
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-12 text-dark/50">
            <p>No news found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
