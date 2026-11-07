import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Sidebar from "./Sidebar";
import Goals from "./components/Goals";
import Finance from "./components/Finance";
import Calendar from "./components/Calendar";
import AIAssistant from "./components/AIAssistant";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  completedAt?: string;
};

type EventPreview = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const getUpcomingEvents = (): EventPreview[] => {
  const savedEvents = localStorage.getItem("lifeos-events");
  if (!savedEvents) return [];

  try {
    const today = new Date().toISOString().split("T")[0];
    return (JSON.parse(savedEvents) as EventPreview[])
      .filter((event) => event.date >= today)
      .sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      )
      .slice(0, 3);
  } catch {
    console.error("Could not load upcoming events.");
    return [];
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem("lifeos-profile-name") || "",
  );
  const [greeting, setGreeting] = useState(getGreeting);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [activeGoals, setActiveGoals] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<EventPreview[]>(getUpcomingEvents);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("lifeos-tasks");

    if (savedTasks) {
      try {
        return JSON.parse(savedTasks) as Task[];
      } catch {
        console.error("Could not load saved tasks.");
      }
    }

    return [
      { id: 1, title: "Review my daily schedule", completed: false },
      { id: 2, title: "Study React fundamentals", completed: true },
      { id: 3, title: "Work on my LifeOS project", completed: false },
    ];
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateMonthlyExpenses = () => {
      const savedTransactions = localStorage.getItem("lifeos-transactions");

      if (!savedTransactions) {
        setMonthlyExpenses(0);
        return;
      }

      try {
        const transactions = JSON.parse(savedTransactions) as {
          type: string;
          date: string;
          amount: number;
        }[];
        const now = new Date();
        const expenses = transactions
          .filter((item) => {
            const transactionDate = new Date(`${item.date}T00:00:00`);
            return (
              item.type === "expense" &&
              transactionDate.getMonth() === now.getMonth() &&
              transactionDate.getFullYear() === now.getFullYear()
            );
          })
          .reduce((total, item) => total + item.amount, 0);

        setMonthlyExpenses(expenses);
      } catch {
        console.error("Could not calculate monthly expenses.");
      }
    };

    updateMonthlyExpenses();
    window.addEventListener("storage", updateMonthlyExpenses);
    return () => window.removeEventListener("storage", updateMonthlyExpenses);
  }, [activeSection]);

  useEffect(() => {
    const updateGoalsCount = () => {
      const savedGoals = localStorage.getItem("lifeos-goals");

      if (!savedGoals) {
        setActiveGoals(0);
        return;
      }

      try {
        const goals = JSON.parse(savedGoals) as { progress: number }[];
        setActiveGoals(goals.filter((goal) => goal.progress < 100).length);
      } catch {
        console.error("Could not calculate active goals.");
      }
    };

    updateGoalsCount();
    window.addEventListener("storage", updateGoalsCount);
    return () => window.removeEventListener("storage", updateGoalsCount);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem("lifeos-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const taskProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const productivityScore = taskProgress;
  const weeklyData = (() => {
    const today = currentDate;
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateString = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: tasks.filter((task) => task.completedAt === dateString).length,
      };
    });
  })();
  const weeklyMax = Math.max(...weeklyData.map((day) => day.count), 1);
  const today = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const money = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(value);

  const addTask = () => {
    if (newTask.trim() === "") return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), title: newTask.trim(), completed: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed
                ? new Date().toISOString().split("T")[0]
                : undefined,
            }
          : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const navigateToSection = (section: string) => {
    setUpcomingEvents(getUpcomingEvents());
    setActiveSection(section);
  };

  const taskInput = (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={newTask}
        onChange={(event) => setNewTask(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") addTask();
        }}
        placeholder="Add a new task..."
        className="min-w-0 w-full flex-1 rounded-xl border px-4 py-3 outline-none"
        style={{
          background: "var(--surface-elevated)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)",
        }}
      />
      <button
        onClick={addTask}
        className="button-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium sm:w-auto"
        style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
      >
        <Plus size={18} />
        Add
      </button>
    </div>
  );

  const taskList = (
    <div
      className="divide-y rounded-2xl border"
      style={{ borderColor: "var(--border-color)" }}
    >
      {tasks.length === 0 ? (
        <p className="p-6 text-center" style={{ color: "var(--text-secondary)" }}>
          No tasks yet. Add your first task!
        </p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="flex min-w-0 items-start gap-3 p-3 sm:p-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="mt-3 h-4 w-4 shrink-0"
              aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
            />
            <span
              className={`min-w-0 flex-1 wrap-break-word py-2 ${
                task.completed ? "line-through opacity-50" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="icon-button flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  );

  const statCard = (label: string, value: string | number, caption: string) => (
    <div
      className="min-w-0 rounded-2xl border p-5 shadow-sm sm:p-6"
      style={{ borderColor: "var(--border-color)" }}
    >
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <h3 className="mt-3 wrap-break-word text-2xl font-bold sm:text-3xl">
        {value}
      </h3>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        {caption}
      </p>
    </div>
  );

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div
        className="app-shell flex min-h-screen flex-col lg:flex-row"
        style={{ color: "var(--text-primary)" }}
      >
        <Sidebar activeSection={activeSection} onNavigate={navigateToSection} />

        <main className="min-w-0 w-full flex-1 px-4 pb-8 pt-20 sm:px-6 sm:pb-10 lg:p-8">
          <header className="app-header mb-8 sm:mb-10">
            <p className="mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {today}
            </p>
            <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
              {greeting}{profileName ? `, ${profileName}` : ""}! <span className="text-cyan-300" aria-hidden="true">✦</span>
            </h1>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Welcome back. Let&apos;s organize your day.
            </p>
          </header>

          {activeSection === "Dashboard" && (
            <section className="min-w-0" aria-label="Dashboard">
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold">Your Overview</h2>
                <p style={{ color: "var(--text-secondary)" }}>
                  Here&apos;s everything you need to stay organized.
                </p>
              </div>

              <section
                className="min-w-0 rounded-2xl border p-4 shadow-sm sm:p-5"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
                aria-labelledby="upcoming-events-heading"
              >
                <h2 id="upcoming-events-heading" className="text-lg font-semibold">
                  Upcoming Events
                </h2>
                {upcomingEvents.length === 0 ? (
                  <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
                    No upcoming events. Add an event in your Calendar!
                  </p>
                ) : (
                  <div className="mt-2 divide-y" style={{ borderColor: "var(--border-color)" }}>
                    {upcomingEvents.map((event) => (
                      <article key={event.id} className="min-w-0 py-3 last:pb-0">
                        <h3 className="wrap-break-word font-medium">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {event.date} at {event.time}
                        </p>
                        {event.description && (
                          <p className="mt-1 wrap-break-word text-sm">
                            {event.description}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4 sm:gap-5">
                {statCard("Total Tasks", totalTasks, "Tasks planned")}
                {statCard("Completed Tasks", completedTasks, "Great progress!")}
                {statCard("Active Goals", activeGoals, "Goals in progress")}
                {statCard("Monthly Expenses", money(monthlyExpenses), "Actual expenses this month")}
              </div>

              <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
                <section
                  className="min-w-0 rounded-2xl border p-5 sm:p-6"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                  aria-labelledby="task-progress-heading"
                >
                  <h2 id="task-progress-heading" className="text-lg font-semibold">
                    Task Completion Progress
                  </h2>
                  <div className="mt-4 mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span>{completedTasks} of {totalTasks} tasks completed</span>
                    <strong>{taskProgress}%</strong>
                  </div>
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full"
                    style={{ background: "var(--border-color)" }}
                    role="progressbar"
                    aria-label="Task completion progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={taskProgress}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-300"
                      style={{ width: `${taskProgress}%`, background: "var(--accent)" }}
                    />
                  </div>
                  <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {remainingTasks} tasks remaining
                  </p>
                </section>

                <section
                  className="min-w-0 rounded-2xl border p-5 shadow-sm sm:p-6"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                  aria-labelledby="productivity-score-heading"
                >
                  <h2 id="productivity-score-heading" className="text-lg font-semibold">
                    Daily Productivity Score
                  </h2>
                  <div className="mt-4 flex min-w-0 items-center gap-4">
                    <div
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[6px] text-2xl font-bold"
                      style={{ borderColor: "var(--border-color)" }}
                      role="img"
                      aria-label={`Productivity score ${productivityScore} percent`}
                    >
                      {productivityScore}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {productivityScore >= 80
                          ? "Excellent work!"
                          : productivityScore >= 50
                            ? "Good progress!"
                            : "Keep going!"}
                      </h3>
                      <p className="mt-1 wrap-break-word text-sm" style={{ color: "var(--text-secondary)" }}>
                        You&apos;ve completed {completedTasks} out of {totalTasks} tasks.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section
                className="mt-5 min-w-0 rounded-2xl border p-5 shadow-sm sm:p-6"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                aria-labelledby="weekly-productivity-heading"
              >
                <h2 id="weekly-productivity-heading" className="text-lg font-semibold">
                  Weekly Productivity Overview
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Tasks completed each day this week
                </p>
                <div className="mt-5 flex h-40 items-end justify-between gap-2 sm:gap-4">
                  {weeklyData.map((item) => (
                    <div key={item.day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <strong className="text-sm">{item.count}</strong>
                      <div
                        className="w-full max-w-9 rounded-t-md transition-[height] duration-300"
                        style={{
                          height: `${Math.max((item.count / weeklyMax) * 110, 6)}px`,
                          background: "var(--accent)",
                        }}
                        aria-hidden="true"
                      />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 min-w-0" aria-labelledby="today-tasks-heading">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 id="today-tasks-heading" className="text-xl font-semibold">
                      Today&apos;s Tasks
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                      Manage your daily activities.
                    </p>
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {completedTasks} of {totalTasks} completed
                  </span>
                </div>
                {taskInput}
                {taskList}
              </section>
            </section>
          )}

          {activeSection === "My Tasks" && (
            <section className="min-w-0" aria-labelledby="all-tasks-heading">
              <h2 id="all-tasks-heading" className="mb-2 text-2xl font-bold">
                My Tasks
              </h2>
              <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
                Manage all your tasks in one place.
              </p>
              {taskInput}
              {taskList}
            </section>
          )}

          {activeSection === "Calendar" && <Calendar />}
          {activeSection === "Finance" && <Finance />}
          {activeSection === "Goals" && <Goals />}
          {activeSection === "AI Assistant" && <AIAssistant />}

          {activeSection === "Settings" && (
            <section className="min-w-0" aria-labelledby="settings-heading">
              <h2 id="settings-heading" className="mb-2 text-2xl font-bold">
                Settings
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Manage your LifeOS preferences.
              </p>

              <section
                className="mt-8 min-w-0 rounded-2xl border p-5 shadow-sm sm:p-6"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                aria-labelledby="profile-settings-heading"
              >
                <h3 id="profile-settings-heading" className="mb-1 text-lg font-semibold">
                  Profile
                </h3>
                <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Personalize your LifeOS profile.
                </p>
                <label htmlFor="profile-name" className="mb-2 block text-sm font-medium">
                  Display Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={(event) => {
                    setProfileName(event.target.value);
                    localStorage.setItem("lifeos-profile-name", event.target.value);
                  }}
                  placeholder="Enter your name..."
                  className="w-full min-w-0 rounded-xl border px-4 py-3 outline-none"
                  style={{
                    background: "var(--surface-elevated)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </section>

              <section
                className="mt-5 min-w-0 rounded-2xl border p-5 shadow-sm sm:p-6"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                aria-labelledby="appearance-settings-heading"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 id="appearance-settings-heading" className="text-lg font-semibold">
                      Appearance
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                      Choose your preferred theme.
                    </p>
                  </div>
                  <button
                    onClick={() => setDarkMode((current) => !current)}
                    className="button-secondary min-h-11 w-full rounded-xl border px-4 py-3 font-medium sm:w-auto"
                    style={{
                      borderColor: "var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </section>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
