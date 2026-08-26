export const DEPARTMENT_LABELS = {
  unsure: "I am not sure",
  darpg: "Department of Administrative Reforms and Public Grievances",
  home: "Ministry of Home Affairs",
  railways: "Ministry of Railways",
  health: "Ministry of Health and Family Welfare",
  posts: "Department of Posts",
  uidai: "Unique Identification Authority of India (UIDAI)",
  other: "Other department",
};

export const CATEGORY_LABELS = {
  service_delay: "Delay in getting a service",
  service_quality: "Poor quality of service",
  pension_benefits: "Pension or benefits",
  documents: "Identity documents or certificates",
  corruption: "Corruption or misconduct",
  other: "Other public service issue",
};

export const STATUS_TRANSITIONS = {
  Received: ["Received", "Under Review", "Resolved", "Rejected"],
  "Under Review": ["Under Review", "Resolved", "Rejected"],
  Resolved: ["Resolved"],
  Rejected: ["Rejected"],
};
