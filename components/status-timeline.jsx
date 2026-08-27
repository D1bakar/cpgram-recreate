import {
  getSla,
  getTimeline,
  SLA_ACKNOWLEDGE_DAYS,
  SLA_RESOLVE_DAYS,
} from "@/lib/sla";

function progressPercent(status, terminal) {
  if (terminal === "resolved") return 100;
  if (terminal === "rejected") return 100;
  if (status === "Under Review") return 50;
  return 8;
}

function barColor(sla, terminal) {
  if (terminal === "resolved") return "bg-[#22c55e]";
  if (terminal === "rejected") return "bg-[#ef4444]";
  if (sla.breached) return "bg-[#f59e0b]";
  return "bg-[#3b82f6]";
}

function circleClasses(state, terminal) {
  if (terminal === "rejected" && state === "done")
    return "border-[#ef4444] bg-[#ef4444] text-white";
  if (terminal === "resolved" && state === "done")
    return "border-[#22c55e] bg-[#22c55e] text-white";
  if (state === "done") return "border-[#3b82f6] bg-[#3b82f6] text-white";
  if (state === "current")
    return "border-[#3b82f6] bg-background text-[#3b82f6] ring-4 ring-[#3b82f6]/15";
  return "border-border bg-background text-muted-foreground";
}

function lineClasses(state) {
  return state === "done"
    ? "bg-gradient-to-b from-[#3b82f6] to-[#3b82f6]/30"
    : "bg-border";
}

function titleClasses(state, terminal) {
  if (terminal === "rejected") return "text-[#ef4444]";
  if (terminal === "resolved" && state === "done") return "text-[#22c55e]";
  if (state === "done" || state === "current") return "text-[#3b82f6]";
  return "text-foreground";
}

function slaBadge(sla) {
  switch (sla.state) {
    case "met":
      return { label: "On time", className: "bg-[#22c55e]/10 text-[#22c55e]" };
    case "breached":
      return {
        label: "SLA missed",
        className: "bg-[#ef4444]/10 text-[#ef4444]",
      };
    case "overdue":
      return { label: "Overdue", className: "bg-[#f59e0b]/10 text-[#f59e0b]" };
    case "stopped":
      return { label: "Closed", className: "bg-muted text-muted-foreground" };
    default:
      return {
        label: "In progress",
        className: "bg-muted text-muted-foreground",
      };
  }
}

const EXPECTED_BY = {
  "Under Review": (sla) => sla.acknowledge.target,
  Resolved: (sla) => sla.resolve.target,
};

export function StatusTimeline({ complaint }) {
  const stages = getTimeline(complaint);
  const sla = getSla(complaint);
  const terminal = complaint.status === "Rejected" ? "rejected" : "resolved";

  const acknowledgeBadge = slaBadge(sla.acknowledge);
  const resolveBadge = slaBadge(sla.resolve);

  const resolveSummary =
    sla.resolve.state === "met"
      ? "Resolved within the service level target."
      : sla.resolve.state === "breached"
        ? "Resolved after the service level target."
        : sla.resolve.state === "stopped"
          ? "Complaint was closed without resolution."
          : sla.resolve.state === "overdue"
            ? `Overdue by ${Math.abs(sla.daysRemaining)} day${
                Math.abs(sla.daysRemaining) === 1 ? "" : "s"
              }.`
            : `Due in ${sla.daysRemaining} day${
                sla.daysRemaining === 1 ? "" : "s"
              }.`;

  const percent = progressPercent(complaint.status, terminal);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div
        className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 ${
          sla.breached
            ? "border-[#f59e0b]/30 bg-[#f59e0b]/5"
            : "border-transparent bg-muted/40"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Service level</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${resolveBadge.className}`}
            >
              {resolveBadge.label}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {resolveSummary}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${acknowledgeBadge.className}`}
        >
          Ack: {acknowledgeBadge.label}
        </span>
      </div>

      <div
        className="mb-7 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Service level progress"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-200 ${barColor(
            sla,
            terminal,
          )}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="relative">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          const expected = EXPECTED_BY[stage.key]?.(sla);
          const glyph =
            stage.state === "done" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span className="text-xs font-semibold">{index + 1}</span>
            );

          return (
            <li key={stage.key} className="relative flex gap-4 pb-7 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={`absolute top-7 left-[15px] h-[calc(100%-1.75rem)] w-px ${lineClasses(
                    stage.state,
                  )}`}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${circleClasses(
                  stage.state,
                  stage.terminal,
                )}`}
              >
                {glyph}
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${titleClasses(
                      stage.state,
                      stage.terminal,
                    )}`}
                  >
                    {stage.label}
                  </p>
                  {stage.state === "current" ? (
                    <span className="inline-flex items-center rounded-full bg-[#3b82f6]/10 px-2 py-0.5 text-xs font-medium text-[#3b82f6]">
                      Current
                    </span>
                  ) : null}
                </div>
                {stage.at ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {sla.formatDate(stage.at)}
                  </p>
                ) : expected ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Expected by {sla.formatDate(expected)}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Awaiting update
                  </p>
                )}
                {stage.note ? (
                  <p className="mt-1.5 text-sm leading-6 text-foreground">
                    {stage.note}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-2 border-t border-border pt-4 text-xs text-muted-foreground">
        Target: acknowledge within {SLA_ACKNOWLEDGE_DAYS} days, resolve within{" "}
        {SLA_RESOLVE_DAYS} days of filing.
      </p>
    </div>
  );
}
