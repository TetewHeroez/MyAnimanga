import { useState, useEffect } from "react";
import { getAiringAnime, AnimeData } from "../services/api";
import AnimeCard from "../components/AnimeCard";
import { AnimeGridSkeleton } from "../components/Skeleton";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SchedulePage = () => {
  const [airingAnime, setAiringAnime] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  useEffect(() => {
    async function fetchSchedule() {
      setIsLoading(true);
      try {
        // For now, just fetch airing anime
        // In a real app, we'd have schedule data from Jikan's /schedules endpoint
        const data = await getAiringAnime(25);
        setAiringAnime(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchedule();
  }, []);

  // Simulate schedule by distributing anime across days
  const getAnimeForDay = (dayIndex: number): AnimeData[] => {
    return airingAnime.filter((_, index) => index % 7 === dayIndex);
  };

  const todayIndex = new Date().getDay();

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Anime Schedule
          </h1>
          <p className="text-dark/60">See what's airing each day of the week</p>
        </div>

        {/* Day Selector */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-hide">
          {DAYS.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all ${
                selectedDay === index
                  ? "bg-primary text-white"
                  : index === todayIndex
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "bg-cream-300 text-dark hover:bg-cream-400"
              }`}
            >
              <span className="block text-sm">{day.slice(0, 3)}</span>
              {index === todayIndex && (
                <span className="block text-xs opacity-70">Today</span>
              )}
            </button>
          ))}
        </div>

        {/* Selected Day Header */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-dark">{DAYS[selectedDay]}</h2>
          {selectedDay === todayIndex && (
            <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
              Today
            </span>
          )}
        </div>

        {/* Anime Grid */}
        {isLoading ? (
          <AnimeGridSkeleton count={8} />
        ) : (
          <>
            {getAnimeForDay(selectedDay).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                {getAnimeForDay(selectedDay).map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 mx-auto text-dark/30 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-dark/50">
                  No anime scheduled for {DAYS[selectedDay]}
                </p>
              </div>
            )}
          </>
        )}

        {/* Weekly Overview */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-dark mb-6">Weekly Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS.map((day, index) => {
              const dayAnime = getAnimeForDay(index);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedDay === index
                      ? "bg-primary text-white"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{day}</span>
                    {index === todayIndex && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedDay === index
                            ? "bg-white/20"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${selectedDay === index ? "text-white/70" : "text-dark/50"}`}
                  >
                    {dayAnime.length} anime
                  </p>
                  {dayAnime.length > 0 && (
                    <div className="flex -space-x-2 mt-2">
                      {dayAnime.slice(0, 4).map((anime) => (
                        <img
                          key={anime.mal_id}
                          src={anime.images.jpg.small_image_url}
                          alt={anime.title}
                          className="w-8 h-8 rounded-full border-2 border-cream object-cover"
                        />
                      ))}
                      {dayAnime.length > 4 && (
                        <div
                          className={`w-8 h-8 rounded-full border-2 border-cream flex items-center justify-center text-xs font-medium ${
                            selectedDay === index
                              ? "bg-white/20 text-white"
                              : "bg-cream-300 text-dark"
                          }`}
                        >
                          +{dayAnime.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
