import { NextResponse } from "next/server";
import {
  extractMemoryFromMessages,
  type ChatMessage,
} from "@/lib/memory";
import sampleConversation from "@/data/sample-conversation.json";

export async function GET() {
  const messages = sampleConversation as ChatMessage[];
  const memory = await extractMemoryFromMessages(messages);
  return NextResponse.json(memory);
}
