// lib/personality.ts

import type { UserMemory } from "./memory";

export type PersonalityId = "neutral" | "calm_mentor" | "witty_friend" | "therapist_style";

export const PERSONALITY_LABELS: Record<PersonalityId, string> = {
  neutral: "Neutral Assistant",
  calm_mentor: "Calm Mentor",
  witty_friend: "Witty Friend",
  therapist_style: "Therapist-style Listener",
};

export function applyPersonalityTone(
  baseReply: string,
  personality: PersonalityId,
  memory?: UserMemory
): string {
  // Later we will make this smarter and pass instructions to the LLM.
  // For now, just wrap the base reply to prove wiring.
  switch (personality) {
    case "calm_mentor":
      return `👨‍🏫 (Calm mentor tone) ${baseReply}`;
    case "witty_friend":
      return `😄 (Witty friend tone) ${baseReply}`;
    case "therapist_style":
      return `🧠 (Therapist-style tone) ${baseReply}`;
    case "neutral":
    default:
      return baseReply;
  }
}
