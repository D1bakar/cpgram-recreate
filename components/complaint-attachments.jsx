"use client";

import { isImageAttachment } from "@/lib/attachments";

export function ComplaintAttachments({ attachments = [], title, emptyLabel }) {
  if (!attachments.length) {
    return emptyLabel ? (
      <p className="mt-3 text-base text-muted-foreground">{emptyLabel}</p>
    ) : null;
  }

  return (
    <div>
      {title ? (
        <h3 className="text-[19px] font-bold">{title}</h3>
      ) : null}
      <ul className={title ? "mt-5 space-y-6" : "space-y-6"}>
        {attachments.map((item) => {
          const key = item.publicId || item.url;
          const label = item.originalName || "Document";
          if (isImageAttachment(item)) {
            return (
              <li key={key}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={item.url}
                    alt={label}
                    className="max-h-80 w-auto max-w-full border border-[#b1b4b6] bg-white object-contain"
                  />
                </a>
                <p className="mt-2 break-all text-sm text-muted-foreground">
                  {label}
                </p>
              </li>
            );
          }
          return (
            <li key={key}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#1d70b8] underline-offset-4 hover:underline"
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
