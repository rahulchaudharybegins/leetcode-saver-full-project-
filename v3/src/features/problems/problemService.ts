import type { Problem } from "./problemTypes";

export function getProblemTitle(problem: Problem): string {
  return (
    problem.problemName?.trim() ||
    getTitleFromUrl(problem.problemUrl) ||
    "Untitled problem"
  );
}

function getTitleFromUrl(url: string): string | null {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    const slug = segments.at(-1);

    return slug
      ? slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
      : null;
  } catch {
    return null;
  }
}

export function formatVisitedDate(value: unknown): string {
  if (!value) return "Not available";

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    date = value.toDate();
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    return "Not available";
  }

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}