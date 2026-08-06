export function calculateProgress(startDateStr, dueDateStr, currentStatus) {
  if (currentStatus === "done") return 100;
  if (currentStatus === "todo") return 0;

  if (!startDateStr || !dueDateStr) return 50;

  const start = new Date(startDateStr).getTime();
  const due = new Date(dueDateStr).getTime();
  const now = new Date().getTime();

  if (isNaN(start) || isNaN(due)) return 50;
  if (now <= start) return 0;
  if (now >= due) return 99;

  const totalDuration = due - start;
  const elapsed = now - start;

  const percentage = Math.round((elapsed / totalDuration) * 100);
  return Math.min(Math.max(percentage, 1), 99);
}