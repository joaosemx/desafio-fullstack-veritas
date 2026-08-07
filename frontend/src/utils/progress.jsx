export function calculateProgress(startDate, dueDate, status) {
  const currentStatus = (status || "").toLowerCase();

  if (currentStatus === "done") return 100;
  if (currentStatus === "todo") return 0;

  if (!startDate || !dueDate) return 50;

  const start = new Date(startDate).getTime();
  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();

  if (isNaN(start) || isNaN(due) || due <= start) return 50;

  if (now <= start) return 10;
  if (now >= due) return 90;

  const total = due - start;
  const elapsed = now - start;

  const calculated = Math.round((elapsed / total) * 100);
  return Math.min(Math.max(calculated, 10), 90);
}