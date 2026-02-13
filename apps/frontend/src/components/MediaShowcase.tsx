import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getTopAnime,
  getAiringAnime,
  getTopManga,
  getLatestManga,
  getTopLightNovels,
  getLatestLightNovels,
  AnimeData,
  MangaData,
} from "../services/api";

// ============ CARD COMPONENTS ============

interface AnimeCardProps {
  anime: AnimeData;
  size?: "small" | "medium" | "large";
}

const AnimeCard = ({ anime, size = "medium" }: AnimeCardProps) => {
  const sizeClasses = {
    small: "w-36 h-52 lg:w-40 lg:h-60",
    medium: "w-44 h-64 lg:w-52 lg:h-76 xl:w-56 xl:h-80",
    large: "w-52 h-76 lg:w-60 lg:h-88",
  };

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-accent-gray relative group cursor-pointer shrink-0 select-none block`}
    >
      <img
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-linear-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-cream text-sm font-medium line-clamp-2">
            {anime.title_english || anime.title}
          </p>
          {anime.score && (
            <p className="text-accent-orange text-xs flex items-center gap-1 mt-1">
              ⭐ {anime.score}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

interface MangaCardProps {
  manga: MangaData;
  size?: "small" | "medium" | "large";
}

const MangaCard = ({ manga, size = "medium" }: MangaCardProps) => {
  const sizeClasses = {
    small: "w-36 h-52 lg:w-40 lg:h-60",
    medium: "w-44 h-64 lg:w-52 lg:h-76 xl:w-56 xl:h-80",
    large: "w-52 h-76 lg:w-60 lg:h-88",
  };

  const linkPath =
    manga.type === "Light Novel"
      ? `/lightnovel/${manga.mal_id}`
      : `/manga/${manga.mal_id}`;

  return (
    <Link
      to={linkPath}
      className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-accent-gray relative group cursor-pointer shrink-0 select-none block`}
    >
      <img
        src={manga.images.jpg.large_image_url}
        alt={manga.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-linear-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-cream text-sm font-medium line-clamp-2">
            {manga.title_english || manga.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {manga.score && (
              <p className="text-accent-orange text-xs">⭐ {manga.score}</p>
            )}
            {manga.type && (
              <span className="text-cream/70 text-xs">{manga.type}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ============ DRAG TO SCROLL HOOK ============

const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      ref.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, isDragging };
};

// ============ SECTION HEADER COMPONENT ============

interface SectionHeaderProps {
  title: string;
  description: string;
  accentColor?: string;
}

const SectionHeader = ({
  title,
  description,
  accentColor = "primary",
}: SectionHeaderProps) => (
  <div className="mb-8 lg:mb-12">
    <h2
      className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-${accentColor} mb-3`}
    >
      {title}
    </h2>
    <p className="text-dark/70 text-base lg:text-lg max-w-3xl">{description}</p>
  </div>
);

// ============ SCROLLABLE ROW COMPONENT ============

interface ScrollableRowProps {
  title: string;
  children: React.ReactNode;
  dragHook: ReturnType<typeof useDragScroll>;
  seeAllLink?: string;
}

const ScrollableRow = ({
  title,
  children,
  dragHook,
  seeAllLink,
}: ScrollableRowProps) => (
  <div className="mb-8 lg:mb-10">
    <div className="flex items-center justify-between mb-4 lg:mb-6">
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark">
        {title}
      </h3>
      {seeAllLink && (
        <Link
          to={seeAllLink}
          className="text-primary text-sm sm:text-base lg:text-lg font-semibold hover:underline"
        >
          See All
        </Link>
      )}
    </div>
    <div
      ref={dragHook.ref}
      onMouseDown={dragHook.onMouseDown}
      onMouseMove={dragHook.onMouseMove}
      onMouseUp={dragHook.onMouseUp}
      onMouseLeave={dragHook.onMouseLeave}
      className={`flex gap-3 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide ${dragHook.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {children}
    </div>
  </div>
);

// ============ MAIN COMPONENT ============

const MediaShowcase = () => {
  // Anime state
  const [topAnime, setTopAnime] = useState<AnimeData[]>([]);
  const [airingAnime, setAiringAnime] = useState<AnimeData[]>([]);

  // Manga state
  const [topManga, setTopManga] = useState<MangaData[]>([]);
  const [latestManga, setLatestManga] = useState<MangaData[]>([]);

  // Light Novel state
  const [topLightNovels, setTopLightNovels] = useState<MangaData[]>([]);
  const [latestLightNovels, setLatestLightNovels] = useState<MangaData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drag hooks for each row
  const topAnimeDrag = useDragScroll();
  const airingDrag = useDragScroll();
  const topMangaDrag = useDragScroll();
  const latestMangaDrag = useDragScroll();
  const topLNDrag = useDragScroll();
  const latestLNDrag = useDragScroll();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          topAnimeData,
          airingAnimeData,
          topMangaData,
          latestMangaData,
          topLNData,
          latestLNData,
        ] = await Promise.all([
          getTopAnime(15),
          getAiringAnime(15),
          getTopManga(15),
          getLatestManga(15),
          getTopLightNovels(15),
          getLatestLightNovels(15),
        ]);

        setTopAnime(topAnimeData || []);
        setAiringAnime(airingAnimeData || []);
        setTopManga(topMangaData || []);
        setLatestManga(latestMangaData || []);
        setTopLightNovels(topLNData || []);
        setLatestLightNovels(latestLNData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-cream py-12 px-4 sm:px-6 lg:px-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          <p className="text-dark/60 mt-4 text-lg">
            Loading your animanga world...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-cream py-12 px-4 sm:px-6 lg:px-12">
        <div className="text-center py-20">
          <p className="text-dark/60 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-cream py-12 sm:py-16 lg:py-20">
      {/* ============ ANIME SECTION ============ */}
      <div className="px-4 sm:px-6 lg:px-12 mb-16 lg:mb-24">
        <SectionHeader
          title="Anime"
          description="Anime is a style of animation originating from Japan, known for its vibrant art, fantastical themes, and diverse genres. From action-packed adventures to heartfelt romances, anime offers stories that captivate audiences of all ages around the world."
        />

        <ScrollableRow
          title="Top Anime"
          dragHook={topAnimeDrag}
          seeAllLink="/trending"
        >
          {topAnime.length > 0 ? (
            topAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} size="small" />
            ))
          ) : (
            <p className="text-dark/50">No anime found</p>
          )}
        </ScrollableRow>

        <ScrollableRow
          title="Currently Airing"
          dragHook={airingDrag}
          seeAllLink="/schedule"
        >
          {airingAnime.length > 0 ? (
            airingAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} size="small" />
            ))
          ) : (
            <p className="text-dark/50">No anime found</p>
          )}
        </ScrollableRow>
      </div>

      {/* ============ MANGA SECTION ============ */}
      <div className="mb-16 lg:mb-24 bg-cream-200 py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
        <SectionHeader
          title="Manga"
          description="Manga are Japanese comic books and graphic novels, read from right to left. With stunning artwork and compelling narratives, manga spans every genre imaginable—from shonen action to slice-of-life stories—and has inspired countless anime adaptations."
        />

        <ScrollableRow title="Top Manga" dragHook={topMangaDrag}>
          {topManga.length > 0 ? (
            topManga.map((manga) => (
              <MangaCard key={manga.mal_id} manga={manga} size="small" />
            ))
          ) : (
            <p className="text-dark/50">No manga found</p>
          )}
        </ScrollableRow>

        <ScrollableRow title="Latest Releases" dragHook={latestMangaDrag}>
          {latestManga.length > 0 ? (
            latestManga.map((manga) => (
              <MangaCard key={manga.mal_id} manga={manga} size="small" />
            ))
          ) : (
            <p className="text-dark/50">No manga found</p>
          )}
        </ScrollableRow>
      </div>

      {/* ============ LIGHT NOVEL SECTION ============ */}
      <div className="px-4 sm:px-6 lg:px-12">
        <SectionHeader
          title="Light Novels"
          description="Light novels are Japanese young adult novels, typically featuring illustrations and concise, engaging prose. They often serve as the source material for popular anime and manga, offering deeper storylines and character development for dedicated fans."
        />

        <ScrollableRow title="Top Light Novels" dragHook={topLNDrag}>
          {topLightNovels.length > 0 ? (
            topLightNovels.map((ln) => (
              <MangaCard key={ln.mal_id} manga={ln} size="small" />
            ))
          ) : (
            <p className="text-dark/50">No light novels found</p>
          )}
        </ScrollableRow>

        <ScrollableRow title="Latest Releases" dragHook={latestLNDrag}>
          {latestLightNovels.length > 0 ? (
            latestLightNovels.map((ln) => (
              <MangaCard key={ln.mal_id} manga={ln} size="small" />
            ))
          ) : (
            <p className="text-dark/50">No light novels found</p>
          )}
        </ScrollableRow>
      </div>
    </section>
  );
};

export default MediaShowcase;
