import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Skeleton } from "../components/Skeleton";

interface CharacterDetail {
  mal_id: number;
  name: string;
  name_kanji: string | null;
  nicknames: string[];
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
  favorites: number;
  about: string | null;
}

interface CharacterAnime {
  anime: {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
  };
  role: string;
}

interface VoiceActor {
  person: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
  language: string;
}

const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [animeList, setAnimeList] = useState<CharacterAnime[]>([]);
  const [voiceActors, setVoiceActors] = useState<VoiceActor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // Fetch character details
        const charRes = await fetch(
          `https://api.jikan.moe/v4/characters/${id}/full`,
        );
        const charData = await charRes.json();
        setCharacter(charData.data);
        setAnimeList(charData.data?.anime || []);
        setVoiceActors(charData.data?.voices || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="aspect-3/4 rounded-2xl" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="bg-cream min-h-screen pt-24 pb-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-dark">Character not found</h1>
        <Link
          to="/characters"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Back to Characters
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/characters"
            className="text-primary hover:underline text-sm"
          >
            ← Back to Characters
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={character.images.jpg.image_url}
                alt={character.name}
                className="w-full max-w-sm mx-auto rounded-2xl shadow-xl"
              />
              <div className="mt-4 bg-white/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  ❤️ {character.favorites.toLocaleString()}
                </p>
                <p className="text-sm text-dark/60">Favorites</p>
              </div>
            </div>
          </div>

          {/* Character Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
                {character.name}
              </h1>
              {character.name_kanji && (
                <p className="text-xl text-dark/60 mb-2">
                  {character.name_kanji}
                </p>
              )}
              {character.nicknames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {character.nicknames.map((nick, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-cream-300 rounded-full text-sm text-dark"
                    >
                      {nick}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            {character.about && (
              <div className="bg-white/50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-dark mb-3">About</h2>
                <p className="text-dark/80 whitespace-pre-line text-sm leading-relaxed">
                  {character.about.slice(0, 1500)}
                  {character.about.length > 1500 ? "..." : ""}
                </p>
              </div>
            )}

            {/* Voice Actors */}
            {voiceActors.length > 0 && (
              <div className="bg-white/50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-dark mb-4">
                  Voice Actors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {voiceActors.slice(0, 8).map((va, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-cream rounded-lg p-2"
                    >
                      <img
                        src={va.person.images.jpg.image_url}
                        alt={va.person.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-dark text-sm">
                          {va.person.name}
                        </p>
                        <p className="text-xs text-dark/60">{va.language}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anime Appearances */}
            {animeList.length > 0 && (
              <div className="bg-white/50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-dark mb-4">
                  Anime Appearances
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {animeList.slice(0, 8).map((item, i) => (
                    <Link
                      key={i}
                      to={`/anime/${item.anime.mal_id}`}
                      className="group"
                    >
                      <div className="aspect-3/4 rounded-lg overflow-hidden bg-cream-200">
                        <img
                          src={item.anime.images.jpg.image_url}
                          alt={item.anime.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="mt-1 text-xs font-medium text-dark line-clamp-2 group-hover:text-primary">
                        {item.anime.title}
                      </p>
                      <p className="text-xs text-primary">{item.role}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailPage;
