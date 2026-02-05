import { useState, useEffect } from "react";

interface Settings {
  theme: "light" | "dark" | "system";
  language: string;
  titleLanguage: "english" | "romaji" | "native";
  defaultListStatus: string;
  showNSFW: boolean;
  autoUpdateProgress: boolean;
  notifications: {
    newEpisodes: boolean;
    recommendations: boolean;
    news: boolean;
  };
}

const defaultSettings: Settings = {
  theme: "light",
  language: "en",
  titleLanguage: "english",
  defaultListStatus: "plan_to_watch",
  showNSFW: false,
  autoUpdateProgress: true,
  notifications: {
    newEpisodes: true,
    recommendations: false,
    news: false,
  },
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateNotification = (
    key: keyof Settings["notifications"],
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("userSettings");
    setSaved(false);
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Settings ⚙️
          </h1>
          <p className="text-dark/60">Customize your MyAnimanga experience</p>
        </div>

        {/* Save notification */}
        {saved && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 animate-pulse">
            ✓ Settings saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-dark mb-4">🎨 Appearance</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Theme
                </label>
                <div className="flex gap-2">
                  {(["light", "dark", "system"] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting("theme", theme)}
                      className={`flex-1 py-3 rounded-xl font-medium capitalize transition-all ${
                        settings.theme === theme
                          ? "bg-primary text-white"
                          : "bg-white text-dark hover:bg-cream-200"
                      }`}
                    >
                      {theme === "light" && "☀️ "}
                      {theme === "dark" && "🌙 "}
                      {theme === "system" && "💻 "}
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Title Language
                </label>
                <select
                  value={settings.titleLanguage}
                  onChange={(e) =>
                    updateSetting("titleLanguage", e.target.value as any)
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300"
                >
                  <option value="english">
                    English (e.g., Attack on Titan)
                  </option>
                  <option value="romaji">
                    Romaji (e.g., Shingeki no Kyojin)
                  </option>
                  <option value="native">Native (e.g., 進撃の巨人)</option>
                </select>
              </div>
            </div>
          </div>

          {/* List Settings */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-dark mb-4">
              📋 List Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Default List Status (Anime)
                </label>
                <select
                  value={settings.defaultListStatus}
                  onChange={(e) =>
                    updateSetting("defaultListStatus", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300"
                >
                  <option value="watching">Watching</option>
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <p className="font-medium text-dark">Auto-update Progress</p>
                  <p className="text-sm text-dark/60">
                    Automatically increment episode/chapter count
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting(
                      "autoUpdateProgress",
                      !settings.autoUpdateProgress,
                    )
                  }
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.autoUpdateProgress ? "bg-primary" : "bg-cream-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      settings.autoUpdateProgress
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-dark mb-4">🔞 Content</h2>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl">
              <div>
                <p className="font-medium text-dark">Show NSFW Content</p>
                <p className="text-sm text-dark/60">
                  Display adult-only anime and manga
                </p>
              </div>
              <button
                onClick={() => updateSetting("showNSFW", !settings.showNSFW)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.showNSFW ? "bg-primary" : "bg-cream-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    settings.showNSFW ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-dark mb-4">
              🔔 Notifications
            </h2>

            <div className="space-y-3">
              {[
                {
                  key: "newEpisodes",
                  label: "New Episodes",
                  desc: "When new episodes air for anime in your list",
                },
                {
                  key: "recommendations",
                  label: "Recommendations",
                  desc: "Personalized anime recommendations",
                },
                {
                  key: "news",
                  label: "News & Updates",
                  desc: "Anime news and site updates",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-white rounded-xl"
                >
                  <div>
                    <p className="font-medium text-dark">{item.label}</p>
                    <p className="text-sm text-dark/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      updateNotification(
                        item.key as any,
                        !settings.notifications[
                          item.key as keyof Settings["notifications"]
                        ],
                      )
                    }
                    className={`w-14 h-8 rounded-full transition-colors ${
                      settings.notifications[
                        item.key as keyof Settings["notifications"]
                      ]
                        ? "bg-primary"
                        : "bg-cream-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        settings.notifications[
                          item.key as keyof Settings["notifications"]
                        ]
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={saveSettings}
              className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Save Settings
            </button>
            <button
              onClick={resetSettings}
              className="px-6 py-4 bg-white text-dark rounded-xl font-medium hover:bg-cream-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
