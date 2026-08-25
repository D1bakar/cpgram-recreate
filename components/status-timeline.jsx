import {
  getSla,
  getTimeline,
  SLA_ACKNOWLEDGE_DAYS,
  SLA_RESOLVE_DAYS,
} from "@/lib/sla";

function dotClasses(state, terminal) {
  if (terminal === "rejected") return "border-[#ef4444] bg-[#ef4444]";
  if (state === "done" && terminal === "resolved")
    return "border-[#22c55e] bg-[#22c55e]";
  if (state === "done" || state === "current")
    return "border-[#3b82f6] bg-[#3b82f6]";
  return "border-border bg-background";
}

function lineClasses(state) {
  return state === "done" ? "bg-[#3b82f6]/40" : "bg-border";
}

function textClasses(state, terminal) {
  if (terminal === "rejected") return "text-[#ef4444]";
  if (state === "done" && terminal === "resolved") return "text-[#22c55e]";
  if (state === "done" || state === "current") return "text-[#3b82f6]";
  return "text-muted-foreground";
}

function slaBadge(sla) {
  switch (sla.state) {
    case "met":
      return {
        label: "On time",
        className: "bg-[#22c55e]/10 text-[#22c55e]",
      };
    case "breached":
      return {
        label: "SLA missed",
        className: "bg-[#ef4444]/10 text-[#ef4444]",
      };
    case "overdue":
      return {
        label: "Overdue",
        className: "bg-[#f59e0b]/10 text-[#f59e0b]",
      };
    case "stopped":
      return {
        label: "Closed",
        className: "bg-muted text-muted-foreground",
      };
    default:
      return {
        label: "In progress",
        className: "bg-muted text-muted-foreground",
      };
  }
}

export function StatusTimeline({ complaint }) {
  const stages = getTimeline(complaint);
  const sla = getSla(complaint);

  const acknowledgeBadge = slaBadge(sla.acknowledge);
  const resolveBadge = slaBadge(sla.resolve);

  let resolveSummary;
  if (sla.resolve.state === "met") {
    resolveSummary = "Resolved within the service level target.";
  } else if (sla.resolve.state === "breached") {
    resolveSummary = "Resolved after the service level target.";
  } else if (sla.resolve.state === "stopped") {
    resolveSummary = "Complaint was closed without resolution.";
  } else if (sla.resolve.state === "overdue") {
    resolveSummary = `Overdue by ${Math.abs(sla.daysRemaining)} day${
      Math.abs(sla.daysRemaining) === 1 ? "" : "s"
    }.`;
  } else {
    resolveSummary = `Due in ${sla.daysRemaining} day${
      sla.daysRemaining === 1 ? "" : "s"
    }.`;
  }

  return (
    <div>
      <div
        className={`rounded-lg border p-4 ${
          sla.breached
            ? "border-[#f59e0b]/30 bg-[#f59e0b]/5"
            : "border-border bg-card"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Service level</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${resolveBadge.className}`}
          >
            {resolveBadge.label}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {resolveSummary}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Target: acknowledge within {SLA_ACKNOWLEDGE_DAYS} days, resolve within{" "}
          {SLA_RESOLVE_DAYS} days of filing.
        </p>
      </div>

      <ol className="mt-8">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          return (
            <li key={stage.key} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={`absolute top-3 left-1.75 h-full w-px ${lineClasses(
                    stage.state,
                  )}`}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={`relative mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${dotClasses(
                  stage.state,
                  stage.terminal,
                )}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${textClasses(
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

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${acknowledgeBadge.className}`}
        >
          Acknowledgement: {acknowledgeBadge.label}
        </span>
      </div>
    </div>
  );
}
