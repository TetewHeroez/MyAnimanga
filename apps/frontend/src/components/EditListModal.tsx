import { useState, useEffect } from "react";
import { updateListItem, type ListItem } from "../services/api";

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ListItem | null;
  onUpdate: (updatedItem: ListItem) => void;
}

const EditListModal = ({
  isOpen,
  onClose,
  item,
  onUpdate,
}: EditListModalProps) => {
  const [status, setStatus] = useState(item?.status || "watching");
  const [score, setScore] = useState(item?.score || 0);
  const [progress, setProgress] = useState(item?.progress || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setScore(item.score || 0);
      setProgress(item.progress || 0);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const isAnime = item.type === "anime";
  const progressLabel = isAnime ? "Episodes" : "Chapters";
  const maxProgress = undefined; // Not tracked in current ListItem, can be added later

  const statusOptions = isAnime
    ? [
        { value: "watching", label: "Watching" },
        { value: "completed", label: "Completed" },
        { value: "plan_to_watch", label: "Plan to Watch" },
        { value: "on_hold", label: "On Hold" },
        { value: "dropped", label: "Dropped" },
      ]
    : [
        { value: "reading", label: "Reading" },
        { value: "completed", label: "Completed" },
        { value: "plan_to_read", label: "Plan to Read" },
        { value: "on_hold", label: "On Hold" },
        { value: "dropped", label: "Dropped" },
      ];

  const handleSave = async () => {
    setLoading(true);
    const result = await updateListItem(item.id, {
      status: status as any,
      score,
      progress,
    });

    if (result) {
      onUpdate({ ...item, status: status as any, score, progress });
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header with image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-4">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-24 object-cover rounded-lg shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold line-clamp-2">
                {item.titleEnglish || item.title}
              </h2>
              <p className="text-white/60 text-sm capitalize">{item.type}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-cream-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Score */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Score:{" "}
              <span className="text-primary font-bold">
                {score || "Not rated"}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-dark/50 mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              {progressLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProgress(Math.max(0, progress - 1))}
                className="w-10 h-10 rounded-xl bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-dark font-bold transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                max={maxProgress}
                value={progress}
                onChange={(e) =>
                  setProgress(Math.max(0, Number(e.target.value)))
                }
                className="flex-1 px-4 py-2 bg-white rounded-xl border border-cream-300 text-center font-bold focus:border-primary outline-none"
              />
              <button
                onClick={() =>
                  setProgress(
                    maxProgress
                      ? Math.min(maxProgress, progress + 1)
                      : progress + 1,
                  )
                }
                className="w-10 h-10 rounded-xl bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-dark font-bold transition-colors"
              >
                +
              </button>
            </div>
            {maxProgress && (
              <p className="text-xs text-dark/50 mt-1 text-center">
                / {maxProgress} {progressLabel.toLowerCase()}
              </p>
            )}
          </div>

          {/* Quick Progress Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setProgress(0)}
              className="flex-1 py-2 bg-cream-200 hover:bg-cream-300 rounded-lg text-sm font-medium text-dark transition-colors"
            >
              Reset
            </button>
            {maxProgress && (
              <button
                onClick={() => {
                  setProgress(maxProgress);
                  setStatus("completed");
                }}
                className="flex-1 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium text-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => setProgress(progress + 1)}
              className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors"
            >
              +1 {isAnime ? "Ep" : "Ch"}
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListModal;
