
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  Clock,
} from "lucide-react";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
};

function Calendar() {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("lifeos-events");

    if (saved) {
      try {
        return JSON.parse(saved) as Event[];
      } catch {
        console.error("Could not load calendar events.");
      }
    }

    return [];
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "lifeos-events",
      JSON.stringify(events)
    );
  }, [events]);

  const addEvent = () => {
    if (!title.trim() || !date || !time) return;

    const newEvent: Event = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      date,
      time,
    };

    setEvents((previous) =>
      [...previous, newEvent].sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      )
    );

    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
  };

  const deleteEvent = (id: number) => {
    setEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );
  };

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarDays size={22} style={{ color: "var(--accent-hover)" }} />
          Calendar & Schedule
        </h2>

        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Keep track of your appointments and important events.
        </p>
      </div>

      {/* Add Event Form */}
      <div
        className="border rounded-2xl p-4 sm:p-6 mb-8 shadow-sm"
        style={{ borderColor: "var(--border-color)" }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus size={18} />
          Add New Event
        </h3>

        <div className="flex min-w-0 flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title..."
            className="w-full min-w-0 border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description (optional)..."
            rows={3}
            className="w-full min-w-0 max-w-full resize-none border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--surface-elevated)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-w-0 border rounded-xl px-4 py-3"
              style={{
                background: "var(--surface-elevated)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full min-w-0 border rounded-xl px-4 py-3"
              style={{
                background: "var(--surface-elevated)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <button
            onClick={addEvent}
            className="button-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium sm:w-auto"
            style={{
              background: "var(--accent)",
              color: "var(--accent-contrast)",
            }}
          >
            <Plus size={18} />
            Save Event
          </button>
        </div>
      </div>

      {/* Event List */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} style={{ color: "var(--accent-hover)" }} />
          Upcoming Events
        </h3>

        {events.length === 0 ? (
          <p
            className="text-center p-8 border rounded-2xl"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            No events yet. Add your first event!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium wrap-anywhere">{event.title}</h4>

                  {event.description && (
                    <p
                      className="mt-1 text-sm wrap-break-word"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {event.description}
                    </p>
                  )}

                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {event.date} · {event.time}
                  </p>
                </div>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="icon-button flex h-11 w-11 shrink-0 self-end items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 sm:self-center"
                  aria-label={`Delete ${event.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
