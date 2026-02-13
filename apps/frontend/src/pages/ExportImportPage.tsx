import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserList, type ListItem } from "../services/api";

interface ExportData {
  version: "1.0";
  exportDate: string;
  list: ListItem[];
}

const ExportImportPage = () => {
  const [list, setList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [importData, setImportData] = useState("");

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setLoading(true);
    const userList = await getUserList();
    setList(userList);
    setLoading(false);
  };

  const exportList = () => {
    const exportData: ExportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      list: list,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `myanimanga-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage({ type: "success", text: "List exported successfully!" });
  };

  const exportCSV = () => {
    const headers = [
      "Type",
      "MAL ID",
      "Title",
      "Status",
      "Score",
      "Progress",
      "Date Added",
    ];
    const rows = list.map((item) => [
      item.type,
      item.malId,
      `"${(item.titleEnglish || item.title).replace(/"/g, '""')}"`,
      item.status,
      item.score || "",
      item.progress,
      item.addedAt,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `myanimanga-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage({ type: "success", text: "CSV exported successfully!" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const importList = () => {
    try {
      const data = JSON.parse(importData);
      if (!data.list || !Array.isArray(data.list)) {
        setMessage({ type: "error", text: "Invalid import file format" });
        return;
      }

      // TODO: Actually import to backend
      setMessage({
        type: "success",
        text: `Found ${data.list.length} items. Import to backend not implemented yet.`,
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to parse import file" });
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-2">
            Export / Import 📦
          </h1>
          <p className="text-dark/60">
            Backup or transfer your anime/manga list
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-xl mb-6 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span>📤</span> Export Your List
            </h2>
            <p className="text-dark/60 text-sm mb-6">
              Download your anime/manga list as a backup file. You have{" "}
              {list.length} items in your list.
            </p>

            <div className="space-y-3">
              <button
                onClick={exportList}
                disabled={list.length === 0}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export as JSON
              </button>
              <button
                onClick={exportCSV}
                disabled={list.length === 0}
                className="w-full bg-white border border-primary text-primary py-3 rounded-xl font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export as CSV
              </button>
            </div>

            <div className="mt-6 p-4 bg-cream-200 rounded-xl">
              <h3 className="font-medium text-dark text-sm mb-2">
                Supported Formats:
              </h3>
              <ul className="text-xs text-dark/60 space-y-1">
                <li>• JSON - Full data with all details</li>
                <li>• CSV - Spreadsheet compatible</li>
              </ul>
            </div>
          </div>

          {/* Import */}
          <div className="bg-white/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span>📥</span> Import List
            </h2>
            <p className="text-dark/60 text-sm mb-6">
              Import your list from a backup file or from other platforms.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Or Paste JSON
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder='{"version": "1.0", "list": [...]}'
                  rows={4}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300 text-sm resize-none"
                />
              </div>

              <button
                onClick={importList}
                disabled={!importData}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>

            <div className="mt-6 p-4 bg-cream-200 rounded-xl">
              <h3 className="font-medium text-dark text-sm mb-2">
                Import from:
              </h3>
              <ul className="text-xs text-dark/60 space-y-1">
                <li>• MyAnimanga JSON backup</li>
                <li>• MyAnimeList (coming soon)</li>
                <li>• AniList (coming soon)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {list.length > 0 && (
          <div className="mt-8 bg-white/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-dark mb-4">
              Current List Summary
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-dark">{list.length}</p>
                <p className="text-xs text-dark/60">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {list.filter((i) => i.type === "anime").length}
                </p>
                <p className="text-xs text-dark/60">Anime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {list.filter((i) => i.type === "manga").length}
                </p>
                <p className="text-xs text-dark/60">Manga</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {list.filter((i) => i.status === "completed").length}
                </p>
                <p className="text-xs text-dark/60">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    list.filter(
                      (i) => i.status === "watching" || i.status === "reading",
                    ).length
                  }
                </p>
                <p className="text-xs text-dark/60">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {list.filter((i) => i.status === "dropped").length}
                </p>
                <p className="text-xs text-dark/60">Dropped</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportImportPage;
