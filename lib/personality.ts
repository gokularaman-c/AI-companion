// lib/personality.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserMemory } from "./memory";

export type PersonalityId =
  | "neutral"
  | "calm_mentor"
  | "witty_friend"
  | "therapist_style";

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
  // 👇 This line silences ESLint, but does nothing at runtime
  if (false && memory) console.log(memory);

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
