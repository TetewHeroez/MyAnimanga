import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getSavedUser,
  getUserList,
  type User,
  type ListItem,
} from "../services/api";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [list, setList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const savedUser = getSavedUser();
      setUser(savedUser);

      if (savedUser) {
        const userList = await getUserList();
        setList(userList);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-dark mb-4">Login Required</h1>
          <p className="text-dark/60 mb-6">Please login to view your profile</p>
          <Link
            to="/"
            className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const animeList = list.filter((i) => i.type === "anime");
  const mangaList = list.filter(
    (i) => i.type === "manga" || i.type === "lightnovel",
  );

  const animeStats = {
    watching: animeList.filter((i) => i.status === "watching").length,
    completed: animeList.filter((i) => i.status === "completed").length,
    planToWatch: animeList.filter((i) => i.status === "plan_to_watch").length,
    dropped: animeList.filter((i) => i.status === "dropped").length,
    onHold: animeList.filter((i) => i.status === "on_hold").length,
    total: animeList.length,
    episodesWatched: animeList.reduce((sum, i) => sum + i.progress, 0),
  };

  const mangaStats = {
    reading: mangaList.filter((i) => i.status === "reading").length,
    completed: mangaList.filter((i) => i.status === "completed").length,
    planToRead: mangaList.filter((i) => i.status === "plan_to_read").length,
    dropped: mangaList.filter((i) => i.status === "dropped").length,
    onHold: mangaList.filter((i) => i.status === "on_hold").length,
    total: mangaList.length,
    chaptersRead: mangaList.reduce((sum, i) => sum + i.progress, 0),
  };

  const avgScore =
    list.filter((i) => i.score).reduce((sum, i) => sum + (i.score || 0), 0) /
    (list.filter((i) => i.score).length || 1);

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/50 rounded-2xl p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl lg:text-5xl font-bold shadow-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
                {user.username}
              </h1>
              <p className="text-dark/60 mb-4">{user.email}</p>
              <p className="text-sm text-dark/50">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {avgScore.toFixed(1)}
              </p>
              <p className="text-sm text-dark/60">Mean Score</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Anime Stats */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <span className="text-2xl">📺</span> Anime Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dark/70">Total Anime</span>
                <span className="font-bold text-dark">{animeStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark/70">Episodes Watched</span>
                <span className="font-bold text-primary">
                  {animeStats.episodesWatched}
                </span>
              </div>
              <div className="h-px bg-cream-300 my-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {animeStats.watching}
                  </p>
                  <p className="text-xs text-blue-600/70">Watching</p>
                </div>
                <div className="bg-green-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {animeStats.completed}
                  </p>
                  <p className="text-xs text-green-600/70">Completed</p>
                </div>
                <div className="bg-purple-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {animeStats.planToWatch}
                  </p>
                  <p className="text-xs text-purple-600/70">Plan to Watch</p>
                </div>
                <div className="bg-yellow-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {animeStats.onHold}
                  </p>
                  <p className="text-xs text-yellow-600/70">On Hold</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manga Stats */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <span className="text-2xl">📚</span> Manga Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dark/70">Total Manga</span>
                <span className="font-bold text-dark">{mangaStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark/70">Chapters Read</span>
                <span className="font-bold text-primary">
                  {mangaStats.chaptersRead}
                </span>
              </div>
              <div className="h-px bg-cream-300 my-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {mangaStats.reading}
                  </p>
                  <p className="text-xs text-blue-600/70">Reading</p>
                </div>
                <div className="bg-green-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {mangaStats.completed}
                  </p>
                  <p className="text-xs text-green-600/70">Completed</p>
                </div>
                <div className="bg-purple-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {mangaStats.planToRead}
                  </p>
                  <p className="text-xs text-purple-600/70">Plan to Read</p>
                </div>
                <div className="bg-yellow-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {mangaStats.onHold}
                  </p>
                  <p className="text-xs text-yellow-600/70">On Hold</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-dark mb-6">Recent Activity</h2>
          {list.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {list.slice(0, 12).map((item) => (
                <Link
                  key={item.id}
                  to={
                    item.type === "anime"
                      ? `/anime/${item.malId}`
                      : `/manga/${item.malId}`
                  }
                  className="group"
                >
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-cream-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                    {item.titleEnglish || item.title}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark/50 py-8">
              No activity yet. Start adding anime/manga to your list!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
