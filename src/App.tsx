import { useState, useEffect } from "react";
import { Sun, Moon, Plus, Trash2 } from "lucide-react";
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
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [profileName, setProfileName] = useState(() => {
  return localStorage.getItem("lifeos-profile-name") || "";
});
const [greeting, setGreeting] = useState(() => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
});

useEffect(() => {
  const updateGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  };

  updateGreeting();

  const interval = setInterval(updateGreeting, 60000);

  return () => clearInterval(interval);
}, []);

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [activeGoals, setActiveGoals] = useState(0);
const [monthlyExpenses, setMonthlyExpenses] = useState(0);
const [upcomingEvents, setUpcomingEvents] = useState<
  {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
  }[]
>([]);
useEffect(() => {
  const loadUpcomingEvents = () => {
    const savedEvents = localStorage.getItem("lifeos-events");

    if (savedEvents) {
      try {
        const events = JSON.parse(savedEvents);

        const today = new Date().toISOString().split("T")[0];

        const upcoming = events
          .filter((event: { date: string }) => event.date >= today)
          .sort((a: { date: string; time: string }, b: { date: string; time: string }) => {
            return (
              a.date.localeCompare(b.date) ||
              a.time.localeCompare(b.time)
            );
          })
          .slice(0, 3);

        setUpcomingEvents(upcoming);
      } catch {
        console.error("Could not load upcoming events.");
      }
    } else {
      setUpcomingEvents([]);
    }
  };

  loadUpcomingEvents();
}, [activeSection]);
useEffect(() => {
  const updateMonthlyExpenses = () => {
    const savedTransactions = localStorage.getItem(
      "lifeos-transactions"
    );

    if (savedTransactions) {
      try {
        const transactions = JSON.parse(savedTransactions);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const expenses = transactions
          .filter((item: {
            type: string;
            date: string;
            amount: number;
          }) => {
            const transactionDate = new Date(
              item.date + "T00:00:00"
            );

            return (
              item.type === "expense" &&
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            );
          })
          .reduce(
            (total: number, item: { amount: number }) =>
              total + item.amount,
            0
          );

        setMonthlyExpenses(expenses);
      } catch {
        console.error("Could not calculate monthly expenses.");
      }
    } else {
      setMonthlyExpenses(0);
    }
  };

  updateMonthlyExpenses();

  window.addEventListener("storage", updateMonthlyExpenses);

  return () => {
    window.removeEventListener("storage", updateMonthlyExpenses);
  };
}, [activeSection]);
useEffect(() => {
  const updateGoalsCount = () => {
    const savedGoals = localStorage.getItem("lifeos-goals");

    if (savedGoals) {
      try {
        const goals = JSON.parse(savedGoals);
        const active = goals.filter(
          (goal: { progress: number }) => goal.progress < 100
        ).length;

        setActiveGoals(active);
      } catch {
        console.error("Could not calculate active goals.");
      }
    } else {
      setActiveGoals(0);
    }
  };

  updateGoalsCount();

  window.addEventListener("storage", updateGoalsCount);

  return () => {
    window.removeEventListener("storage", updateGoalsCount);
  };
}, [activeSection]);
const [tasks, setTasks] = useState<Task[]>(() => {
  const savedTasks = localStorage.getItem("lifeos-tasks");

  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
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
const totalTasks = tasks.length;

const completedTasks = tasks.filter(
  (task: { completed: boolean }) => task.completed
).length;

const remainingTasks = totalTasks - completedTasks;

const taskProgress =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);
    const productivityScore = taskProgress;
    const weeklyData = (() => {
  const today = new Date();
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

    const count = tasks.filter(
      (task) => task.completedAt === dateString
    ).length;

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      count,
    };
  });
})();

// Save tasks whenever they change
useEffect(() => {
  localStorage.setItem("lifeos-tasks", JSON.stringify(tasks));
}, [tasks]);

const [newTask, setNewTask] = useState("");
// Add a new task
const addTask = () => {
  if (newTask.trim() === "") return;

  setTasks([
    ...tasks,
    {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
    },
  ]);

  setNewTask("");
};

// Complete or uncomplete a task
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
        : task
    )
  );
};

// Delete a task
const deleteTask = (id: number) => {
  setTasks(tasks.filter((task) => task.id !== id));
};


  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen flex"
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <Sidebar
         activeSection={activeSection}
           onNavigate={setActiveSection}
        />

        <main className="flex-1 min-w-0 w-full p-4 pt-20 sm:p-6 md:p-8">
          {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
            <div>
              <p
                className="text-sm mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {today}
              </p>

<h1 className="text-2xl sm:text-3xl font-bold">
  {greeting}{profileName ? `, ${profileName}` : ""}! 👋
</h1>
              <p
                className="mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Welcome back. Let's organize your day.
              </p>
            </div>
          </div>
          


{activeSection === "Dashboard" && (
  
  <>
    {/* Dashboard Overview */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">
        Your Overview
      </h2>

      <p style={{ color: "var(--text-secondary)" }}>
        Here's everything you need to stay organized.
      </p>
    </div>
    {/* Upcoming Events */}
<div
  style={{
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
transition: "all 0.2s ease"
  }}
>
  <h2>Upcoming Events</h2>

  {upcomingEvents.length === 0 ? (
    <p style={{ color: "var(--text-secondary)" }}>
      No upcoming events. Add an event in your Calendar!
    </p>
  ) : (
    upcomingEvents.map((event) => (
      <div
        key={event.id}
        style={{
          padding: "12px 0",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <strong>{event.title}</strong>
        <p style={{ color: "var(--text-secondary)", margin: "4px 0" }}>
          {event.date} at {event.time}
        </p>
        {event.description && <p>{event.description}</p>}
      </div>
    ))
  )}
</div>


    {/* Statistics Cards */}
   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">

      <div
        className="border rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Total Tasks
        </p>
        <h3 className="text-3xl font-bold mt-3">
          {tasks.length}
        </h3>
        <p className="text-sm mt-2"
          style={{ color: "var(--text-secondary)" }}>
          Tasks planned
        </p>
      </div>
      {/* Task Completion Progress */}
<div
  style={{
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "24px",
  }}
>
  <h2>Task Completion Progress</h2>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    }}
  >
    <span>{completedTasks} of {totalTasks} tasks completed</span>
    <strong>{taskProgress}%</strong>
  </div>

  <div
    style={{
      width: "100%",
      height: "10px",
      background: "var(--border-color)",
      borderRadius: "20px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${taskProgress}%`,
        height: "100%",
        background: "var(--text-primary)",
        borderRadius: "20px",
        transition: "width 0.3s ease",
      }}
    />
  </div>

  <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
    {remainingTasks} tasks remaining
  </p>
</div>
{/* Daily Productivity Score */}
<div
  style={{
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
           borderRadius: "12px",
    marginTop: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.2s ease",
  }}
>
  <h2>Daily Productivity Score</h2>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginTop: "16px",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        border: "6px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      {productivityScore}
    </div>

    <div>
      <h3 style={{ margin: 0 }}>
        {productivityScore >= 80
          ? "Excellent work!"
          : productivityScore >= 50
          ? "Good progress!"
          : "Keep going!"}
      </h3>

      <p style={{ color: "var(--text-secondary)" }}>
        You've completed {completedTasks} out of {totalTasks} tasks.
      </p>
    </div>
  </div>
</div>

{/* Weekly Productivity Overview */}
<div
  style={{
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
       borderRadius: "12px",
    padding: "20px",
    marginTop: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.2s ease",
  }}
>
  <h2>Weekly Productivity Overview</h2>

  <p style={{ color: "var(--text-secondary)" }}>
    Tasks completed each day this week
  </p>

  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
     gap: "6px",
height: "160px",
marginTop: "20px",
    }}
  >
    {weeklyData.map((item) => (
      <div
        key={item.day}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          height: "100%",
          justifyContent: "flex-end",
        }}
      >
        <strong>{item.count}</strong>

        <div
          style={{
            width: "100%",
            maxWidth: "36px",
            height: `${Math.max((item.count / Math.max(...weeklyData.map((day) => day.count), 1)) * 110, 6)}px`,
            background: "var(--text-primary)",
            borderRadius: "6px 6px 0 0",
            transition: "height 0.3s ease",
          }}
        />

        <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
          {item.day}
        </span>
      </div>
    ))}
  </div>
</div>

      <div
        className="border rounded-2xl p-6"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Completed Tasks
        </p>
        <h3 className="text-3xl font-bold mt-3">
          {tasks.filter((task) => task.completed).length}
        </h3>
        <p className="text-sm mt-2"
          style={{ color: "var(--text-secondary)" }}>
          Great progress!
        </p>
      </div>

      <div
        className="border rounded-2xl p-6"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Active Goals
        </p>
        <h3 className="text-3xl font-bold mt-3">
  {activeGoals}
</h3>
        <p className="text-sm mt-2"
          style={{ color: "var(--text-secondary)" }}>
          Goals in progress
        </p>
      </div>

      <div
        className="border rounded-2xl p-6"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Monthly Expenses
        </p>
        <h3 className="text-3xl font-bold mt-3">
  {new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(monthlyExpenses)}
</h3>
        <p className="text-sm mt-2"
          style={{ color: "var(--text-secondary)" }}>
         Actual expenses this month
        </p>
      </div>
    </div>

{/* Task Completion Progress */}
{/* Daily Productivity Score */}
{/* Weekly Productivity Overview */}

    {/* Today's Tasks */}
    <div className="mt-10">
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-semibold">
            Today's Tasks
          </h2>
          <p className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}>
            Manage your daily activities.
          </p>
        </div>

        <span className="text-sm"
          style={{ color: "var(--text-secondary)" }}>
          {tasks.filter((task) => task.completed).length} of {tasks.length} completed
        </span>
      </div>

    <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Add a new task..."
          className="flex-1 min-w-0 border rounded-xl px-4 py-3 outline-none"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        />

        <button
          onClick={addTask}
         className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium w-full sm:w-auto"
          style={{
            background: "var(--text-primary)",
            color: "var(--bg-primary)",
          }}
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div
        className="border rounded-2xl divide-y"
        style={{ borderColor: "var(--border-color)" }}
      >
        {tasks.length === 0 ? (
          <p className="p-6 text-center"
            style={{ color: "var(--text-secondary)" }}>
            No tasks yet. Add your first task!
          </p>
        ) : (
          tasks.map((task) => (
            <div key={task.id}
              className="flex items-center gap-3 p-3 sm:p-4 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4"
              />

              <span className={`flex-1 ${
                task.completed ? "line-through opacity-50" : ""
              }`}>
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  </>
)}

{activeSection === "My Tasks" && (
  <div>
    <h2 className="text-2xl font-bold mb-2">
      My Tasks
    </h2>

    <p
      className="mb-6"
      style={{ color: "var(--text-secondary)" }}
    >
      Manage all your tasks in one place.
    </p>

    <div className="flex gap-3 mb-5">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
        placeholder="Add a new task..."
        className="flex-1 min-w-0 border rounded-xl px-4 py-3 outline-none"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)",
        }}
      />

      <button
        onClick={addTask}
        className="px-5 py-3 rounded-xl font-medium"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <Plus size={18} />
      </button>
    </div>

    <div
      className="border rounded-2xl divide-y"
      style={{ borderColor: "var(--border-color)" }}
    >
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />

          <span className={`flex-1 ${
            task.completed ? "line-through opacity-50" : ""
          }`}>
            {task.title}
          </span>

          <button
            onClick={() => deleteTask(task.id)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{activeSection === "Calendar" && <Calendar />}

{activeSection === "Finance" && <Finance />}

{activeSection === "Goals" && <Goals />}

{activeSection === "AI Assistant" && <AIAssistant />}

{activeSection === "Settings" && (
  <div>
    <h2 className="text-2xl font-bold mb-2">
      Settings
    </h2>

    <p style={{ color: "var(--text-secondary)" }}>
      Manage your LifeOS preferences.
    </p>

{/* Profile Settings */}
<div
  className="mt-8 border rounded-2xl p-6 shadow-sm"
  style={{
    background: "var(--bg-secondary)",
    borderColor: "var(--border-color)",
  }}
>
  <h3 className="font-semibold text-lg mb-1">
    Profile
  </h3>

  <p
    className="text-sm mb-5"
    style={{ color: "var(--text-secondary)" }}
  >
    Personalize your LifeOS profile.
  </p>

  <div>
    <label className="text-sm font-medium block mb-2">
      Display Name
    </label>

    <input
  type="text"
  value={profileName}
  onChange={(e) => {
    setProfileName(e.target.value);
    localStorage.setItem("lifeos-profile-name", e.target.value);
  }}
  placeholder="Enter your name..."
  className="w-full border rounded-xl px-4 py-3 outline-none"
  style={{
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border-color)",
  }}
/>

  </div>
</div>

    {/* Appearance Settings */}
    <div
      className="mt-8 border rounded-2xl p-6 shadow-sm"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">
            Appearance
          </h3>

          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Choose your preferred theme.
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="border rounded-xl px-4 py-3 font-medium"
          style={{
            borderColor: "var(--border-color)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
}

export default App;
