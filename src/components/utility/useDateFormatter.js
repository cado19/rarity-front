// hooks/useDateFormatter.js

// Full date + time (Option 3)
export function formatDateTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Date only (e.g. "12 May 2026")
export function formatDateOnly(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Time only (e.g. "7:38 PM")
export function formatTimeOnly(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Weekday + date (e.g. "Tue, 12 May 2026")
export function formatWeekdayDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Relative time (e.g. "3 hours ago", "Yesterday", "in 2 days")
export function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (Math.abs(diffSec) < 60) {
    return diffSec >= 0 ? "in a few seconds" : "just now";
  } else if (Math.abs(diffMin) < 60) {
    return diffMin > 0 ? `in ${diffMin} min` : `${Math.abs(diffMin)} min ago`;
  } else if (Math.abs(diffHr) < 24) {
    return diffHr > 0 ? `in ${diffHr} hours` : `${Math.abs(diffHr)} hours ago`;
  } else if (Math.abs(diffDay) < 7) {
    if (diffDay === 1) return "Tomorrow";
    if (diffDay === -1) return "Yesterday";
    return diffDay > 0
      ? `in ${diffDay} days`
      : `${Math.abs(diffDay)} days ago`;
  } else {
    // fallback to date only
    return formatDateOnly(dateString);
  }
}
