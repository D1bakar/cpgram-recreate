export const SLA_ACKNOWLEDGE_DAYS = 2;
export const SLA_RESOLVE_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;
const TERMINAL = { Resolved: true, Rejected: true };

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function entryAt(history, status) {
  const match = [...history].reverse().find((entry) => entry.status === status);
  return match ? new Date(match.at) : null;
}

function formatTimelineDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getTimeline(complaint) {
  const history = complaint.history ?? [];
  const createdAt = new Date(complaint.createdAt);

  const stages = [
    {
      key: "Received",
      label: "Received",
      at: createdAt,
      note: history.find((entry) => entry.status === "Received")?.note ?? "",
      state: "done",
    },
  ];

  const underReviewState =
    complaint.status === "Under Review"
      ? "current"
      : complaint.status === "Resolved" || complaint.status === "Rejected"
        ? "done"
        : "pending";
  stages.push({
    key: "Under Review",
    label: "Under Review",
    at: entryAt(history, "Under Review"),
    note: history.find((entry) => entry.status === "Under Review")?.note ?? "",
    state: underReviewState,
  });

  if (complaint.status === "Rejected") {
    stages.push({
      key: "Rejected",
      label: "Rejected",
      at: entryAt(history, "Rejected"),
      note: history.find((entry) => entry.status === "Rejected")?.note ?? "",
      state: "done",
      terminal: "rejected",
    });
  } else {
    stages.push({
      key: "Resolved",
      label: "Resolved",
      at: entryAt(history, "Resolved"),
      note: history.find((entry) => entry.status === "Resolved")?.note ?? "",
      state: complaint.status === "Resolved" ? "done" : "pending",
      terminal: "resolved",
    });
  }

  return stages;
}

export function getSla(complaint) {
  const createdAt = new Date(complaint.createdAt);
  const history = complaint.history ?? [];
  const now = Date.now();

  const acknowledgeTarget = addDays(createdAt, SLA_ACKNOWLEDGE_DAYS);
  const resolveTarget = addDays(createdAt, SLA_RESOLVE_DAYS);

  const underReviewAt = entryAt(history, "Under Review");
  const resolvedAt = entryAt(history, "Resolved");
  const isTerminal = Boolean(TERMINAL[complaint.status]);

  const acknowledge = {
    target: acknowledgeTarget,
    at: underReviewAt,
    met: null,
  };
  if (underReviewAt) {
    acknowledge.met = underReviewAt.getTime() <= acknowledgeTarget.getTime();
    acknowledge.state = acknowledge.met ? "met" : "breached";
  } else if (!isTerminal && now > acknowledgeTarget.getTime()) {
    acknowledge.state = "overdue";
  } else {
    acknowledge.state = "pending";
  }

  const resolve = { target: resolveTarget, at: resolvedAt, met: null };
  if (complaint.status === "Resolved") {
    if (resolvedAt) {
      resolve.met = resolvedAt.getTime() <= resolveTarget.getTime();
      resolve.state = resolve.met ? "met" : "breached";
    } else {
      resolve.state = "pending";
    }
  } else if (complaint.status === "Rejected") {
    resolve.state = "stopped";
  } else if (!isTerminal && now > resolveTarget.getTime()) {
    resolve.state = "overdue";
  } else {
    resolve.state = "pending";
  }

  const daysRemaining = Math.ceil((resolveTarget.getTime() - now) / DAY_MS);

  const breached =
    acknowledge.state === "overdue" ||
    acknowledge.state === "breached" ||
    resolve.state === "overdue" ||
    resolve.state === "breached";

  return {
    acknowledge,
    resolve,
    daysRemaining,
    isTerminal,
    breached,
    formatDate: formatTimelineDate,
  };
}
