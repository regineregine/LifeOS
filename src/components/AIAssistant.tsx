import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Lightbulb,
} from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "assistant";
};

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your LifeOS Assistant. I can help you organize your tasks, goals, and daily schedule. What would you like help with today?",
      sender: "assistant",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: "Thanks for your message! I'm currently a demo assistant. Once we connect an AI service, I'll be able to give you personalized suggestions and help manage your day.",
      sender: "assistant",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  };

  return (
    <div className="mt-10 min-w-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles size={22} />
          AI Assistant
        </h2>

        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Your personal assistant for planning and productivity.
        </p>
      </div>

      {/* Assistant Card */}
      <div
        className="flex h-[min(65vh,46rem)] min-h-88 min-w-0 flex-col overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border-color)" }}
      >
        {/* Assistant Introduction */}
        <div
          className="flex shrink-0 items-center gap-3 border-b p-4 sm:p-5"
          style={{
            borderColor: "var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <div className="p-3 rounded-xl border"
            style={{ borderColor: "var(--border-color)" }}
          >
            <Bot size={25} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold">LifeOS Assistant</h3>
            <p
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Your productivity companion
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3 sm:p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex min-w-0 items-start gap-3 ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender === "assistant" && (
                <div className="h-fit shrink-0 rounded-lg border p-2"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div
                className="min-w-0 max-w-[calc(100%-3rem)] wrap-break-word rounded-2xl px-4 py-3"
                style={{
                  background:
                    message.sender === "user"
                      ? "var(--text-primary)"
                      : "var(--bg-secondary)",
                  color:
                    message.sender === "user"
                      ? "var(--bg-primary)"
                      : "var(--text-primary)",
                }}
              >
                <p className="whitespace-pre-wrap wrap-break-word text-sm">{message.text}</p>
              </div>

              {message.sender === "user" && (
                <div className="h-fit shrink-0 rounded-lg border p-2"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="shrink-0 px-4 pb-4 sm:px-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} />
            <p className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Try asking:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Help me plan my day",
              "How can I be productive?",
              "Help me organize my goals",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="min-h-10 max-w-full wrap-break-word border rounded-full px-3 py-2 text-left text-xs hover:opacity-70"
                style={{ borderColor: "var(--border-color)" }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div
          className="flex shrink-0 gap-2 border-t p-3 sm:gap-3 sm:p-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask your LifeOS Assistant..."
            className="min-h-11 min-w-0 flex-1 border rounded-xl px-3 py-3 text-sm outline-none sm:px-4"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <button
            onClick={sendMessage}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
