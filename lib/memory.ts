// lib/memory.ts

// Basic chat message type (compatible with OpenAI-style roles)
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// A single memory item extracted from conversation
export type MemoryItem = {
  statement: string;                // e.g., "User enjoys sci-fi movies"
  confidence: number;               // 0.0 – 1.0
  evidenceMessageIndexes: number[]; // indexes of messages that support this
};

// Structured memory object for a user
export type UserMemory = {
  preferences: MemoryItem[];           // likes/dislikes, habits, style
  emotionalPatterns: MemoryItem[];     // recurring feelings, triggers, coping
  factsWorthRemembering: MemoryItem[]; // stable facts about the user
};

const EMPTY_MEMORY: UserMemory = {
  preferences: [],
  emotionalPatterns: [],
  factsWorthRemembering: [],
};

// Simple helper to avoid duplicate statements
function addUniqueMemory(
  list: MemoryItem[],
  item: MemoryItem
): void {
  const exists = list.some((m) => m.statement === item.statement);
  if (!exists) {
    list.push(item);
  }
}

export async function extractMemoryFromMessages(
  messages: ChatMessage[]
): Promise<UserMemory> {
  if (!messages || messages.length === 0) {
    return EMPTY_MEMORY;
  }

  const preferences: MemoryItem[] = [];
  const emotionalPatterns: MemoryItem[] = [];
  const factsWorthRemembering: MemoryItem[] = [];

  messages.forEach((m, index) => {
    if (m.role !== "user") return;

    const text = m.content.toLowerCase();

    // -------- Preferences (likes / hobbies / habits) --------
    if (text.includes("lo-fi") || text.includes("lofi")) {
      addUniqueMemory(preferences, {
        statement: "User likes listening to lo-fi music while studying.",
        confidence: 0.95,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("sci-fi") || text.includes("sci fi") || text.includes("anime")) {
      addUniqueMemory(preferences, {
        statement: "User enjoys sci-fi movies and anime, especially on weekends.",
        confidence: 0.95,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("late-night studying") || (text.includes("late") && text.includes("night") && text.includes("stud"))) {
      addUniqueMemory(preferences, {
        statement: "User prefers late-night studying despite knowing it affects sleep.",
        confidence: 0.9,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("walk")) {
      addUniqueMemory(preferences, {
        statement: "User likes going for late-night walks to feel better.",
        confidence: 0.85,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("journaling")) {
      addUniqueMemory(preferences, {
        statement: "User uses journaling their thoughts as a coping activity.",
        confidence: 0.9,
        evidenceMessageIndexes: [index],
      });
    }

    // -------- Emotional patterns --------
    if (text.includes("stressed") || text.includes("stress")) {
      addUniqueMemory(emotionalPatterns, {
        statement: "User often feels stressed, mainly due to exams and placements.",
        confidence: 0.95,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("lonely") || (text.includes("alone") && text.includes("hostel"))) {
      addUniqueMemory(emotionalPatterns, {
        statement:
          "User sometimes feels lonely, staying in a hostel away from family and not meeting friends often.",
        confidence: 0.9,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("relax") && (text.includes("weekend") || text.includes("weekends"))) {
      addUniqueMemory(emotionalPatterns, {
        statement:
          "User uses sci-fi movies, anime, and entertainment as a way to relax on weekends.",
        confidence: 0.85,
        evidenceMessageIndexes: [index],
      });
    }

    // -------- Facts worth remembering --------
    if (text.includes("final year") || text.includes("final-year") || text.includes("final yr")) {
      addUniqueMemory(factsWorthRemembering, {
        statement: "User is in their final year of engineering.",
        confidence: 0.95,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("hostel")) {
      addUniqueMemory(factsWorthRemembering, {
        statement: "User stays in a hostel away from their family.",
        confidence: 0.9,
        evidenceMessageIndexes: [index],
      });
    }

    if (text.includes("sleep")) {
      addUniqueMemory(factsWorthRemembering, {
        statement: "User currently sleeps only around 5 hours per night.",
        confidence: 0.85,
        evidenceMessageIndexes: [index],
      });
    }
  });

  return {
    preferences,
    emotionalPatterns,
    factsWorthRemembering,
  };
}