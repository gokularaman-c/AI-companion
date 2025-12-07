import { NextResponse } from "next/server";
import {
  applyPersonalityTone,
  PERSONALITY_LABELS,
  type PersonalityId,
} from "@/lib/personality";

export async function GET() {
  const baseReply = "This is an example reply to the user.";

  const personalities: PersonalityId[] = [
    "neutral",
    "calm_mentor",
    "witty_friend",
    "therapist_style",
  ];

  const variants = personalities.map((id) => ({
    id,
    label: PERSONALITY_LABELS[id],
    reply: applyPersonalityTone(baseReply, id),
  }));

  return NextResponse.json({ baseReply, variants });
}
