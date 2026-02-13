import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getUserList,
  removeFromList as apiRemoveFromList,
  getAuthToken,
  type ListItem,
} from "../services/api";
import EditListModal from "../components/EditListModal";

type ListStatus =
  | "all"
  | "watching"
  | "reading"
  | "completed"
  | "plan_to_watch"
  | "plan_to_read"
  | "dropped"
  | "on_hold";
type MediaType = "all" | "anime" | "manga" | "lightnovel";

const MyListPage = () => {
  const [myList, setMyList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ListStatus>("all");
  const [activeType, setActiveType] = useState<MediaType>("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editItem, setEditItem] = useState<ListItem | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);

    if (token) {
      loadList();
    } else {
      setLoading(false);
    }
  }, []);

  const loadList = async () => {
    setLoading(true);
    const list = await getUserList();
    setMyList(list);
    setLoading(false);
  };

  const filteredList = myList.filter((item) => {
    const statusMatch = activeFilter === "all" || item.status === activeFilter;
    const typeMatch = activeType === "all" || item.type === activeType;
    return statusMatch && typeMatch;
  });

  const statusFilters = [
    { key: "all" as ListStatus, label: "All", count: myList.length },
    {
      key: "watching" as ListStatus,
      label: "Watching",
      count: myList.filter((i) => i.status === "watching").length,
    },
    {
      key: "reading" as ListStatus,
      label: "Reading",
      count: myList.filter((i) => i.status === "reading").length,
    },
    {
      key: "completed" as ListStatus,
      label: "Completed",
      count: myList.filter((i) => i.status === "completed").length,
    },
    {
      key: "plan_to_watch" as ListStatus,
      label: "Plan to Watch",
      count: myList.filter((i) => i.status === "plan_to_watch").length,
    },
    {
      key: "plan_to_read" as ListStatus,
      label: "Plan to Read",
      count: myList.filter((i) => i.status === "plan_to_read").length,
    },
    {
      key: "on_hold" as ListStatus,
      label: "On Hold",
      count: myList.filter((i) => i.status === "on_hold").length,
    },
    {
      key: "dropped" as ListStatus,
      label: "Dropped",
      count: myList.filter((i) => i.status === "dropped").length,
    },
  ].filter((f) => f.key === "all" || f.count > 0);

  const typeFilters = [
    { key: "all" as MediaType, label: "All", count: myList.length },
    {
      key: "anime" as MediaType,
      label: "Anime",
      count: myList.filter((i) => i.type === "anime").length,
    },
    {
      key: "manga" as MediaType,
      label: "Manga",
      count: myList.filter((i) => i.type === "manga").length,
    },
    {
      key: "lightnovel" as MediaType,
      label: "Light Novel",
      count: myList.filter((i) => i.type === "lightnovel").length,
    },
  ].filter((f) => f.key === "all" || f.count > 0);

  const removeFromList = async (itemId: string) => {
    const success = await apiRemoveFromList(itemId);
    if (success) {
      setMyList((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const getDetailLink = (item: ListItem) => {
    if (item.type === "anime") return `/anime/${item.malId}`;
    if (item.type === "lightnovel") return `/lightnovel/${item.malId}`;
    return `/manga/${item.malId}`;
  };

  const handleEditUpdate = (updatedItem: ListItem) => {
    setMyList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <svg
              className="w-20 h-20 mx-auto text-dark/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-dark mb-2">
              Login Required
            </h2>
            <p className="text-dark/50 mb-6">
              Please login to view and manage your anime/manga list.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors"
            >
              Go Home & Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-dark/60">Loading your list...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            My List
          </h1>
          <p className="text-dark/60">Track and manage your anime & manga</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {
                myList.filter(
                  (i) => i.status === "watching" || i.status === "reading",
                ).length
              }
            </p>
            <p className="text-sm text-dark/60">In Progress</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {myList.filter((i) => i.status === "completed").length}
            </p>
            <p className="text-sm text-dark/60">Completed</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {
                myList.filter(
                  (i) =>
                    i.status === "plan_to_watch" || i.status === "plan_to_read",
                ).length
              }
            </p>
            <p className="text-sm text-dark/60">Planned</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {myList.filter((i) => i.status === "on_hold").length}
            </p>
            <p className="text-sm text-dark/60">On Hold</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-dark">{myList.length}</p>
            <p className="text-sm text-dark/60">Total</p>
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {typeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveType(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === filter.key
                  ? "bg-dark text-white"
                  : "bg-cream-300 text-dark hover:bg-cream-400"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 text-xs ${activeType === filter.key ? "text-white/70" : "text-dark/50"}`}
              >
                ({filter.count})
              </span>
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.key
                  ? "bg-primary text-white"
                  : "bg-cream-200 text-dark hover:bg-cream-300"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 text-xs ${activeFilter === filter.key ? "text-white/70" : "text-dark/50"}`}
              >
                ({filter.count})
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {filteredList.map((item) => (
              <div key={item.id} className="relative group">
                <Link to={getDetailLink(item)} className="block">
                  <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-cream-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-dark/80 text-white text-xs rounded-lg capitalize">
                      {item.type === "lightnovel" ? "Light Novel" : item.type}
                    </div>
                    {/* Score Badge */}
                    {item.score && (
                      <div className="absolute top-2 right-10 px-2 py-1 bg-primary text-white text-xs rounded-lg flex items-center gap-1">
                        ★ {item.score}
                      </div>
                    )}
                    {/* Progress Badge */}
                    {item.progress > 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 text-dark text-xs rounded-lg">
                        {item.type === "anime"
                          ? `Ep ${item.progress}`
                          : `Ch ${item.progress}`}
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                    {item.titleEnglish || item.title}
                  </h3>
                  <p className="text-xs text-dark/50 capitalize mt-1">
                    {item.status.replace(/_/g, " ")}
                  </p>
                </Link>
                {/* Remove button */}
                <button
                  onClick={() => removeFromList(item.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  title="Remove from list"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {/* Edit button */}
                <button
                  onClick={() => setEditItem(item)}
                  className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-600 z-10"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <svg
              className="w-20 h-20 mx-auto text-dark/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-xl font-bold text-dark mb-2">
              Your list is empty
            </h2>
            <p className="text-dark/50 mb-6">
              {activeFilter === "all" && activeType === "all"
                ? "Start adding anime/manga to your list to track your progress!"
                : "No items match your current filters"}
            </p>
            <Link
              to="/trending"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Discover Anime
            </Link>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditListModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        item={editItem}
        onUpdate={handleEditUpdate}
      />
    </div>
  );
};

export default MyListPage;
