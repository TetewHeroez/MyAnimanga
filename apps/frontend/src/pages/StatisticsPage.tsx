import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserList, getAuthToken, type ListItem } from "../services/api";

const StatisticsPage = () => {
  const [list, setList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);

    if (token) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, []);

  const loadStats = async () => {
    const userList = await getUserList();
    setList(userList);
    setLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">Login Required</h1>
        <p className="text-dark/60 mb-6">
          Please login to view your statistics
        </p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full">
          Go Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate statistics
  const animeList = list.filter((i) => i.type === "anime");
  const mangaList = list.filter(
    (i) => i.type === "manga" || i.type === "lightnovel",
  );

  const totalEpisodes = animeList.reduce((sum, i) => sum + i.progress, 0);
  const totalChapters = mangaList.reduce((sum, i) => sum + i.progress, 0);

  // Estimate watch time (avg 24 min per episode)
  const watchTimeMinutes = totalEpisodes * 24;
  const watchTimeHours = Math.floor(watchTimeMinutes / 60);
  const watchTimeDays = (watchTimeMinutes / 60 / 24).toFixed(1);

  // Scores distribution
  const scoredItems = list.filter((i) => i.score && i.score > 0);
  const avgScore =
    scoredItems.length > 0
      ? scoredItems.reduce((sum, i) => sum + (i.score || 0), 0) /
        scoredItems.length
      : 0;

  const scoreDistribution = Array.from({ length: 10 }, (_, i) => ({
    score: i + 1,
    count: scoredItems.filter((item) => item.score === i + 1).length,
  }));

  // Status breakdown
  const statusBreakdown = {
    anime: {
      watching: animeList.filter((i) => i.status === "watching").length,
      completed: animeList.filter((i) => i.status === "completed").length,
      planToWatch: animeList.filter((i) => i.status === "plan_to_watch").length,
      dropped: animeList.filter((i) => i.status === "dropped").length,
      onHold: animeList.filter((i) => i.status === "on_hold").length,
    },
    manga: {
      reading: mangaList.filter((i) => i.status === "reading").length,
      completed: mangaList.filter((i) => i.status === "completed").length,
      planToRead: mangaList.filter((i) => i.status === "plan_to_read").length,
      dropped: mangaList.filter((i) => i.status === "dropped").length,
      onHold: mangaList.filter((i) => i.status === "on_hold").length,
    },
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Your Statistics 📊
          </h1>
          <p className="text-dark/60">
            Detailed breakdown of your anime & manga journey
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <p className="text-4xl font-bold">{list.length}</p>
            <p className="text-sm text-white/80">Total Entries</p>
          </div>
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-4xl font-bold">{totalEpisodes}</p>
            <p className="text-sm text-white/80">Episodes Watched</p>
          </div>
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <p className="text-4xl font-bold">{totalChapters}</p>
            <p className="text-sm text-white/80">Chapters Read</p>
          </div>
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <p className="text-4xl font-bold">{avgScore.toFixed(1)}</p>
            <p className="text-sm text-white/80">Mean Score</p>
          </div>
        </div>

        {/* Watch Time */}
        <div className="bg-white/50 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-dark mb-4">
            ⏰ Time Spent Watching
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">
                {watchTimeMinutes.toLocaleString()}
              </p>
              <p className="text-sm text-dark/60">Minutes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">
                {watchTimeHours.toLocaleString()}
              </p>
              <p className="text-sm text-dark/60">Hours</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{watchTimeDays}</p>
              <p className="text-sm text-dark/60">Days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Distribution */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-dark mb-4">
              ⭐ Score Distribution
            </h2>
            <div className="space-y-2">
              {scoreDistribution.reverse().map(({ score, count }) => (
                <div key={score} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-medium text-dark">
                    {score}
                  </span>
                  <div className="flex-1 h-6 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${scoredItems.length > 0 ? (count / scoredItems.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm text-dark/60">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-dark mb-4">
              📋 Status Breakdown
            </h2>

            <h3 className="font-semibold text-dark mb-2">Anime</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-600">
                  {statusBreakdown.anime.watching}
                </p>
                <p className="text-xs text-blue-600/70">Watching</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-green-600">
                  {statusBreakdown.anime.completed}
                </p>
                <p className="text-xs text-green-600/70">Completed</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-purple-600">
                  {statusBreakdown.anime.planToWatch}
                </p>
                <p className="text-xs text-purple-600/70">Plan to Watch</p>
              </div>
              <div className="bg-red-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-red-600">
                  {statusBreakdown.anime.dropped}
                </p>
                <p className="text-xs text-red-600/70">Dropped</p>
              </div>
            </div>

            <h3 className="font-semibold text-dark mb-2">Manga</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-600">
                  {statusBreakdown.manga.reading}
                </p>
                <p className="text-xs text-blue-600/70">Reading</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-green-600">
                  {statusBreakdown.manga.completed}
                </p>
                <p className="text-xs text-green-600/70">Completed</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-purple-600">
                  {statusBreakdown.manga.planToRead}
                </p>
                <p className="text-xs text-purple-600/70">Plan to Read</p>
              </div>
              <div className="bg-red-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-red-600">
                  {statusBreakdown.manga.dropped}
                </p>
                <p className="text-xs text-red-600/70">Dropped</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-dark mb-4">🏆 Milestones</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-xl text-center ${list.length >= 10 ? "bg-yellow-100" : "bg-cream-200"}`}
            >
              <p className="text-2xl mb-1">{list.length >= 10 ? "🏅" : "🔒"}</p>
              <p className="text-sm font-medium text-dark">Beginner</p>
              <p className="text-xs text-dark/60">10 entries</p>
            </div>
            <div
              className={`p-4 rounded-xl text-center ${list.length >= 50 ? "bg-yellow-100" : "bg-cream-200"}`}
            >
              <p className="text-2xl mb-1">{list.length >= 50 ? "🏅" : "🔒"}</p>
              <p className="text-sm font-medium text-dark">Enthusiast</p>
              <p className="text-xs text-dark/60">50 entries</p>
            </div>
            <div
              className={`p-4 rounded-xl text-center ${list.length >= 100 ? "bg-yellow-100" : "bg-cream-200"}`}
            >
              <p className="text-2xl mb-1">
                {list.length >= 100 ? "🏅" : "🔒"}
              </p>
              <p className="text-sm font-medium text-dark">Veteran</p>
              <p className="text-xs text-dark/60">100 entries</p>
            </div>
            <div
              className={`p-4 rounded-xl text-center ${totalEpisodes >= 1000 ? "bg-yellow-100" : "bg-cream-200"}`}
            >
              <p className="text-2xl mb-1">
                {totalEpisodes >= 1000 ? "🏅" : "🔒"}
              </p>
              <p className="text-sm font-medium text-dark">Marathon</p>
              <p className="text-xs text-dark/60">1000 episodes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
