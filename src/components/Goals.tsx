import { useState, useEffect } from "react";
import { Plus, Trash2, Target, CalendarDays } from "lucide-react";

type Goal = {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
};

function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
  const savedGoals = localStorage.getItem("lifeos-goals");

  if (savedGoals) {
    try {
      return JSON.parse(savedGoals) as Goal[];
    } catch {
      console.error("Could not load saved goals.");
    }
  }

  return [
    {
      id: 1,
      title: "Learn React",
      description: "Master React fundamentals and hooks.",
      targetDate: "2026-12-30",
      progress: 65,
    },
    {
      id: 2,
      title: "Build Portfolio",
      description: "Create a professional developer portfolio.",
      targetDate: "2027-01-15",
      progress: 30,
    },
  ];
});

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");

useEffect(() => {
  localStorage.setItem("lifeos-goals", JSON.stringify(goals));
}, [goals]);

  const addGoal = () => {
    if (!newTitle.trim() || !newDate) return;

    const newGoal: Goal = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      targetDate: newDate,
      progress: 0,
    };

    setGoals([...goals, newGoal]);

    setNewTitle("");
    setNewDescription("");
    setNewDate("");
  };

  const updateProgress = (id: number, progress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, progress } : goal
      )
    );
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="mt-10">

      {/* Goals Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">My Goals</h2>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Track your personal goals and progress.
          </p>
        </div>

        <span
          className="text-sm sm:text-right"
          style={{ color: "var(--text-secondary)" }}
        >
          {goals.filter((goal) => goal.progress === 100).length} of {goals.length} completed
        </span>
      </div>

      {/* Add Goal Form */}
      <div
        className="border rounded-2xl p-5 mb-6"
        style={{ borderColor: "var(--border-color)" }}
      >
        <h3 className="font-semibold mb-4">Create a New Goal</h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Goal title..."
            className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Goal description..."
            className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <button
            onClick={addGoal}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            <Plus size={18} />
            Add Goal
          </button>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {goals.length === 0 ? (
          <p
            className="col-span-full text-center p-8"
            style={{ color: "var(--text-secondary)" }}
          >
            No goals yet. Create your first goal!
          </p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="min-w-0 border rounded-2xl p-5"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <Target size={21} />
                </div>

                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label={`Delete ${goal.title}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="wrap-break-word font-semibold text-lg">
                {goal.title}
              </h3>

              <p
                className="mt-2 mb-4 wrap-break-word text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {goal.description || "No description provided."}
              </p>

              <div
                className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                <CalendarDays size={15} />
                <span className="wrap-break-word">Target: {goal.targetDate}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span className="font-semibold">
                  {goal.progress}%
                </span>
              </div>

              <div
                className="w-full h-2 rounded-full overflow-hidden mb-4"
                style={{ background: "var(--bg-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${goal.progress}%`,
                    background: "var(--text-primary)",
                  }}
                />
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={goal.progress}
                onChange={(e) =>
                  updateProgress(goal.id, Number(e.target.value))
                }
                className="w-full cursor-pointer"
                aria-label={`Update progress for ${goal.title}`}
              />

              {goal.progress === 100 && (
                <p className="text-sm font-semibold mt-3">
                  Goal completed!
                </p>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Goals;
