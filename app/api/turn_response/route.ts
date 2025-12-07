// app/api/turn_response/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MODEL, getDeveloperPrompt } from "@/config/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMessages = body.messages || [];

    console.log("Received raw messages for /api/turn_response:", rawMessages);

    // 🔁 1) Normalize messages from Responses-format → chat.completions format
    const chatMessages = (rawMessages as any[]).map((m) => {
      // Default role
      let role: "user" | "assistant" | "system" = "user";
      if (m.role === "assistant" || m.role === "system") {
        role = m.role;
      }

      // Flatten content to a plain string
      let content = "";

      if (Array.isArray(m.content)) {
        // Responses API usually sends: [{ type: "input_text", text: "..." }, ...]
        content = m.content
          .map((part: any) => {
            if (typeof part === "string") return part;
            if (part?.type === "input_text") return part.text ?? "";
            if (part?.type === "output_text") return part.text ?? "";
            if (part?.type === "text") return part.text ?? "";
            return "";
          })
          .join("\n");
      } else if (typeof m.content === "string") {
        content = m.content;
      } else if (m.content && typeof m.content === "object" && "text" in m.content) {
        content = (m.content as any).text ?? "";
      } else if (m.content != null) {
        content = String(m.content);
      }

      return { role, content };
    });

    // 🔁 2) Call OpenRouter via chat.completions
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: getDeveloperPrompt() },
        ...chatMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    // 🔁 3) Return updated messages in a simple format
    const updatedMessages = [
      ...chatMessages,
      { role: "assistant", content: reply },
    ];

    return NextResponse.json({ messages: updatedMessages }, { status: 200 });
  } catch (error: any) {
    console.error(
      "Error in POST /api/turn_response:",
      error?.status,
      error?.code,
      error?.error || error
    );

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
