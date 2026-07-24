export type Phase = "intro" | "quiz" | "analyzing" | "result";
export type SelectKind = "single" | "multi";
export type Answers = Record<string, string[]>;

export const ANALYZING_MS = 4400;

export function getSelected(answers: Answers, questionId: string): string[] {
  return answers[questionId] ?? [];
}

export function isSelected(
  answers: Answers,
  questionId: string,
  optionId: string,
): boolean {
  return getSelected(answers, questionId).includes(optionId);
}

export function toggleOption(
  answers: Answers,
  questionId: string,
  optionId: string,
  kind: SelectKind,
): Answers {
  const current = getSelected(answers, questionId);
  let next: string[];
  if (kind === "single") {
    next = current.includes(optionId) ? [] : [optionId];
  } else {
    next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
  }
  return { ...answers, [questionId]: next };
}

export function canAdvance(answers: Answers, questionId: string): boolean {
  return getSelected(answers, questionId).length > 0;
}

export function nextQuizState(
  activeIndex: number,
  questionCount: number,
): { phase: Phase; activeIndex: number } {
  if (activeIndex >= questionCount - 1) {
    return { phase: "analyzing", activeIndex };
  }
  return { phase: "quiz", activeIndex: activeIndex + 1 };
}

export function prevQuizState(
  activeIndex: number,
): { phase: Phase; activeIndex: number } {
  if (activeIndex <= 0) {
    return { phase: "intro", activeIndex: 0 };
  }
  return { phase: "quiz", activeIndex: activeIndex - 1 };
}

export function progressDots(
  activeIndex: number,
  questionCount: number,
): boolean[] {
  return Array.from({ length: questionCount }, (_, i) => i <= activeIndex);
}
