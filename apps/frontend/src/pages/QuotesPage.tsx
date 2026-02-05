import { useState, useEffect } from "react";

interface Quote {
  anime: string;
  character: string;
  quote: string;
}

// Collection of anime quotes (since there's no free API for this)
const ANIME_QUOTES: Quote[] = [
  {
    anime: "Naruto",
    character: "Naruto Uzumaki",
    quote:
      "I'm not gonna run away, I never go back on my word! That's my nindo: my ninja way!",
  },
  {
    anime: "One Piece",
    character: "Monkey D. Luffy",
    quote:
      "I don't want to conquer anything. I just think the guy with the most freedom in this whole ocean... is the Pirate King!",
  },
  {
    anime: "Attack on Titan",
    character: "Eren Yeager",
    quote: "I'll keep moving forward... until I destroy my enemies.",
  },
  {
    anime: "Death Note",
    character: "L Lawliet",
    quote:
      "There are many types of monsters in this world. Monsters who will not show themselves and who cause trouble. Monsters who abduct children. Monsters who devour dreams. Monsters who suck blood, and... monsters who always tell lies.",
  },
  {
    anime: "Fullmetal Alchemist",
    character: "Edward Elric",
    quote:
      "A lesson without pain is meaningless. That's because no one can gain without sacrificing something.",
  },
  {
    anime: "Hunter x Hunter",
    character: "Gon Freecss",
    quote: "I can be a Hunter that I can be proud of... when I find you.",
  },
  {
    anime: "My Hero Academia",
    character: "All Might",
    quote: "It's fine now. Why? Because I am here!",
  },
  {
    anime: "Dragon Ball Z",
    character: "Vegeta",
    quote: "I am a warrior, and I will not run from anything!",
  },
  {
    anime: "Demon Slayer",
    character: "Tanjiro Kamado",
    quote:
      "No matter how many people you may lose, you have no choice but to go on living. No matter how devastating the blows may be.",
  },
  {
    anime: "Jujutsu Kaisen",
    character: "Gojo Satoru",
    quote: "Throughout Heaven and Earth, I alone am the honored one.",
  },
  {
    anime: "Steins;Gate",
    character: "Okabe Rintaro",
    quote:
      "No one knows what the future holds. That's why its potential is infinite.",
  },
  {
    anime: "Code Geass",
    character: "Lelouch vi Britannia",
    quote:
      "The only ones who should kill are those who are prepared to be killed.",
  },
  {
    anime: "One Punch Man",
    character: "Saitama",
    quote: "I'm just a guy who's a hero for fun.",
  },
  {
    anime: "Tokyo Ghoul",
    character: "Ken Kaneki",
    quote:
      "I'm not the protagonist of a novel or anything. I'm just a college student who likes to read, like you could find anywhere. But... if, for argument's sake, you were to write a story with me in the lead role, it would certainly be... a tragedy.",
  },
  {
    anime: "Mob Psycho 100",
    character: "Reigen Arataka",
    quote:
      "If you have time to think about how you lack presence, then start working on that. What you need is self-confidence.",
  },
  {
    anime: "Cowboy Bebop",
    character: "Spike Spiegel",
    quote:
      "I'm not going there to die. I'm going to find out if I'm really alive.",
  },
  {
    anime: "Neon Genesis Evangelion",
    character: "Shinji Ikari",
    quote: "I mustn't run away. I mustn't run away. I mustn't run away!",
  },
  {
    anime: "Your Lie in April",
    character: "Kaori Miyazono",
    quote:
      "Do you think you could love someone who could never stop lying to herself?",
  },
  {
    anime: "Clannad",
    character: "Tomoya Okazaki",
    quote:
      "The past is the past. It's already over and done with. You can't change what happened. But the future is still an unwritten book.",
  },
  {
    anime: "Violet Evergarden",
    character: "Violet Evergarden",
    quote: "I want to know what 'I love you' means.",
  },
  {
    anime: "Sword Art Online",
    character: "Kirito",
    quote:
      "Sometimes the things that matter the most are right in front of you.",
  },
  {
    anime: "Re:Zero",
    character: "Subaru Natsuki",
    quote: "It's because I'm weak that I need the help of everyone.",
  },
  {
    anime: "Haikyuu!!",
    character: "Hinata Shoyo",
    quote:
      "The future belongs to those who believe in the beauty of their dreams.",
  },
  {
    anime: "Black Clover",
    character: "Asta",
    quote:
      "I'm not gonna be the Wizard King because I want to. I'm going to be the Wizard King because I have to!",
  },
  {
    anime: "Bleach",
    character: "Ichigo Kurosaki",
    quote:
      "If I don't wield the sword, I can't protect you. If I keep wielding the sword, I can't embrace you.",
  },
  {
    anime: "Fairy Tail",
    character: "Natsu Dragneel",
    quote:
      "The moment you think of giving up, think of the reason why you held on so long.",
  },
  {
    anime: "Assassination Classroom",
    character: "Koro-sensei",
    quote:
      "The difference between the novice and the master is that the master has failed more times than the novice has tried.",
  },
  {
    anime: "Spy x Family",
    character: "Anya Forger",
    quote: "I love both of you. Please don't make me choose.",
  },
  {
    anime: "Chainsaw Man",
    character: "Denji",
    quote: "I want to touch some boobs before I die!",
  },
  {
    anime: "Bocchi the Rock!",
    character: "Hitori Gotoh",
    quote:
      "I thought if I became good at guitar, I'd be able to make friends...",
  },
];

const QuotesPage = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(ANIME_QUOTES[0]);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem("favoriteQuotes");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
    // Random quote on load
    randomQuote();
  }, []);

  const randomQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const filtered =
        filter === "all"
          ? ANIME_QUOTES
          : ANIME_QUOTES.filter((q) =>
              q.anime.toLowerCase().includes(filter.toLowerCase()),
            );
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentQuote(random);
      setIsAnimating(false);
    }, 300);
  };

  const toggleFavorite = (quote: Quote) => {
    const isFav = favorites.some((f) => f.quote === quote.quote);
    let newFavorites;

    if (isFav) {
      newFavorites = favorites.filter((f) => f.quote !== quote.quote);
    } else {
      newFavorites = [...favorites, quote];
    }

    setFavorites(newFavorites);
    localStorage.setItem("favoriteQuotes", JSON.stringify(newFavorites));
  };

  const isFavorite = (quote: Quote) =>
    favorites.some((f) => f.quote === quote.quote);

  const uniqueAnimes = [...new Set(ANIME_QUOTES.map((q) => q.anime))];

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Anime Quotes 💬
          </h1>
          <p className="text-dark/60">
            Inspirational quotes from your favorite anime characters
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white rounded-xl border border-cream-300 focus:border-primary outline-none"
          >
            <option value="all">All Anime</option>
            {uniqueAnimes.map((anime) => (
              <option key={anime} value={anime}>
                {anime}
              </option>
            ))}
          </select>
        </div>

        {/* Current Quote Card */}
        <div
          className={`bg-white/70 rounded-3xl p-8 lg:p-12 shadow-lg mb-8 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          <div className="text-6xl text-primary/20 mb-4">"</div>
          <p className="text-xl lg:text-2xl text-dark leading-relaxed mb-6 font-medium">
            {currentQuote.quote}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-dark">{currentQuote.character}</p>
              <p className="text-primary text-sm">{currentQuote.anime}</p>
            </div>
            <button
              onClick={() => toggleFavorite(currentQuote)}
              className={`p-3 rounded-full transition-colors ${
                isFavorite(currentQuote)
                  ? "bg-red-100 text-red-500"
                  : "bg-cream-200 text-dark/40 hover:text-red-400"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isFavorite(currentQuote) ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Random Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={randomQuote}
            className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-600 transition-all hover:scale-105 flex items-center gap-2"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            New Random Quote
          </button>
        </div>

        {/* Favorite Quotes */}
        {favorites.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-6">
              ❤️ Your Favorite Quotes ({favorites.length})
            </h2>
            <div className="space-y-4">
              {favorites.map((quote, i) => (
                <div key={i} className="bg-white/50 rounded-xl p-6">
                  <p className="text-dark/80 mb-3">"{quote.quote}"</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-medium text-dark">
                        {quote.character}
                      </span>
                      <span className="text-dark/50"> — {quote.anime}</span>
                    </p>
                    <button
                      onClick={() => toggleFavorite(quote)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesPage;
