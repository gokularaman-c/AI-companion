"use client";

import React, { useState } from "react";

type PersonalityId = "neutral" | "calm_mentor" | "witty_friend" | "therapist_style";

export default function MemoryDemoPage() {
  const [input, setInput] = useState(
    "Mostly exams and placements. I love late-night studying but it’s ruining my sleep."
  );
  const [personalityId, setPersonalityId] = useState<PersonalityId>("neutral");
  const [reply, setReply] = useState<string>("");
  const [memoryJson, setMemoryJson] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");

  async function handleSend() {
    console.log("▶ handleSend clicked");
    setLoading(true);
    setError(null);
    setReply("");
    setMemoryJson("");
    setStatus("calling /api/memory_chat ...");

    try {
      const res = await fetch("/api/memory_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalityId,
          messages: [
            { role: "user", content: input },
          ],
        }),
      });

      console.log("◀ Response status:", res.status);
      if (!res.ok) {
        setStatus(`error: status ${res.status}`);
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("◀ Response JSON:", data);

      setReply(data.reply ?? "");
      setMemoryJson(JSON.stringify(data.memory ?? {}, null, 2));
      setStatus("done");
    } catch (err: any) {
      console.error("Error in handleSend:", err);
      setError("Something went wrong while calling /api/memory_chat");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Memory + Personality Demo</h1>
        <p className="text-sm text-gray-600">
          This page calls <code>/api/memory_chat</code>, which:
        </p>
        <ul className="list-disc ml-6 text-sm text-gray-600">
          <li>Extracts memory from your message</li>
          <li>Builds a reply using that memory</li>
          <li>Applies the selected personality tone</li>
        </ul>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            User message
          </label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <label className="block text-sm font-medium mt-4">
            Personality
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={personalityId}
            onChange={(e) => setPersonalityId(e.target.value as PersonalityId)}
          >
            <option value="neutral">Neutral Assistant</option>
            <option value="calm_mentor">Calm Mentor</option>
            <option value="witty_friend">Witty Friend</option>
            <option value="therapist_style">Therapist-style Listener</option>
          </select>
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium bg-black text-white disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Send to /api/memory_chat"}
        </button>

        {/* Small status line so we know something happened */}
        <div className="text-xs text-gray-500 mt-1">
          Status: {status}
        </div>

        {error && (
          <div className="text-sm text-red-600 mt-2">
            {error}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <div>
            <h2 className="text-sm font-semibold mb-1">Final reply (with personality):</h2>
            <div className="whitespace-pre-wrap text-sm border rounded-lg px-3 py-2 bg-gray-50">
              {reply || "No reply yet."}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-1">Extracted memory JSON:</h2>
            <pre className="text-xs border rounded-lg px-3 py-2 bg-gray-900 text-green-200 overflow-x-auto max-h-80">
{memoryJson || "// No memory yet."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
