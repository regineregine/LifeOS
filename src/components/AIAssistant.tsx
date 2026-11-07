
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
    <div className="mt-10">
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
        className="border rounded-2xl overflow-hidden"
        style={{ borderColor: "var(--border-color)" }}
      >
        {/* Assistant Introduction */}
        <div
          className="p-5 border-b flex items-center gap-3"
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

          <div>
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
        <div className="p-5 flex flex-col gap-4 min-h-64 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender === "assistant" && (
                <div className="p-2 rounded-lg border h-fit"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div
                className="rounded-2xl px-4 py-3 max-w-[80%]"
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
                <p className="text-sm">{message.text}</p>
              </div>

              {message.sender === "user" && (
                <div className="p-2 rounded-lg border h-fit"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="px-5 pb-4">
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
                className="text-xs border rounded-full px-3 py-2 hover:opacity-70"
                style={{ borderColor: "var(--border-color)" }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div
          className="p-4 border-t flex gap-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask your LifeOS Assistant..."
            className="flex-1 min-w-0 border rounded-xl px-4 py-3 outline-none text-sm"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <button
            onClick={sendMessage}
            className="rounded-xl px-4 py-3"
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
