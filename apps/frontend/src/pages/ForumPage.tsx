import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ForumPost {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  comments: number;
  last_comment: {
    url: string;
    author_username: string;
    author_url: string;
    date: string;
  };
}

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "episode" | "other">("all");

  useEffect(() => {
    fetchForumPosts();
  }, [filter]);

  const fetchForumPosts = async () => {
    setLoading(true);
    try {
      let url = "https://api.jikan.moe/v4/top/anime?limit=5";
      const topRes = await fetch(url);
      const topData = await topRes.json();

      const forumPromises =
        topData.data?.slice(0, 3).map(async (anime: any) => {
          let forumUrl = `https://api.jikan.moe/v4/anime/${anime.mal_id}/forum`;
          if (filter !== "all") {
            forumUrl += `?filter=${filter}`;
          }
          const forumRes = await fetch(forumUrl);
          const forumData = await forumRes.json();
          return (forumData.data || []).map((post: ForumPost) => ({
            ...post,
            animeTitle: anime.title_english || anime.title,
            animeMalId: anime.mal_id,
          }));
        }) || [];

      const allPosts = (await Promise.all(forumPromises)).flat();
      allPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setPosts(allPosts.slice(0, 20));
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
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Forum Discussions 💬
          </h1>
          <p className="text-dark/60">
            Join the conversation about your favorite anime
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "all", label: "All Topics" },
            { key: "episode", label: "Episode Discussions" },
            { key: "other", label: "Other" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-white/50 text-dark hover:bg-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white/50 rounded-2xl overflow-hidden divide-y divide-cream-200">
            {posts.map((post: any, index) => (
              <a
                key={`${post.mal_id}-${index}`}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 hover:bg-white transition-colors"
              >
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <Link
                      to={`/anime/${post.animeMalId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-primary hover:underline"
                    >
                      {post.animeTitle}
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-xs text-dark/50">
                      <span>by {post.author_username}</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4">
                    <span className="text-lg font-bold text-primary">
                      {post.comments}
                    </span>
                    <span className="text-xs text-dark/50">replies</span>
                  </div>
                </div>
                {post.last_comment && (
                  <div className="mt-2 pt-2 border-t border-cream-200 text-xs text-dark/50">
                    Last reply by {post.last_comment.author_username} •{" "}
                    {formatDate(post.last_comment.date)}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12 text-dark/50">
            <p>No discussions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
