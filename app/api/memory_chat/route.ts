// app/api/memory_chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ChatMessage, extractMemoryFromMessages } from "@/lib/memory";
import {
  applyPersonalityTone,
  type PersonalityId,
} from "@/lib/personality";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages: ChatMessage[] = body.messages ?? [];
    const personalityId: PersonalityId = body.personalityId ?? "neutral";

    // 1) Extract memory from the messages
    const memory = await extractMemoryFromMessages(messages);

    // 2) Get last user message (for context)
    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content ??
      "Thanks for sharing that with me.";

    // 3) Build a base reply that uses memory
    let baseReply = `Thanks for opening up.\n\nYou said: "${lastUserMessage}"\n\nHere's what I remember about you so far:\n`;

    if (memory.preferences.length > 0) {
      baseReply += `\n• Preferences:\n`;
      for (const item of memory.preferences) {
        baseReply += `  - ${item.statement}\n`;
      }
    }

    if (memory.emotionalPatterns.length > 0) {
      baseReply += `\n• Emotional patterns I notice:\n`;
      for (const item of memory.emotionalPatterns) {
        baseReply += `  - ${item.statement}\n`;
      }
    }

    if (memory.factsWorthRemembering.length > 0) {
      baseReply += `\n• Important facts about you:\n`;
      for (const item of memory.factsWorthRemembering) {
        baseReply += `  - ${item.statement}\n`;
      }
    }

    if (
      memory.preferences.length === 0 &&
      memory.emotionalPatterns.length === 0 &&
      memory.factsWorthRemembering.length === 0
    ) {
      baseReply += `\nRight now, I don't have enough information to remember anything specific yet, but I'm here to listen.`;
    }

    baseReply += `\n\nGiven all this, I want to respond to you with care and context.`;

    // 4) Apply personality tone on top of the base reply
    const finalReply = applyPersonalityTone(baseReply, personalityId, memory);

    return NextResponse.json({
      ok: true,
      reply: finalReply,
      personalityId,
      memory,
    });
  } catch (err) {
    console.error("Error in memory_chat route:", err);
    return NextResponse.json(
      { ok: false, error: "Failed in memory chat route" },
      { status: 500 },
    );
  }
}
