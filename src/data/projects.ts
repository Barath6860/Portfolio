/**
 * Project content. Visual components read from here — edit text, links and
 * figures in this file only.
 *
 * - TrustScan content follows the project information document (design and
 *   evaluation plan); no result figures are shown.
 * - Links are only set when the destination has been verified.
 */

const TS_REPO = "https://github.com/Barath6860/TrustScan";
const DT_REPO = "https://github.com/Barath6860/DocTranslator";

export type Decision = "trusted" | "reviewed" | "withheld";

export const trustscan = {
  title: "TrustScan",
  subtitle: "Bias-Aware Abstention for Autism Neuroimaging",
  description:
    "A bias-aware research framework for ASD-related fMRI. It pairs a candidate ASD prediction model with a trust layer — scan quality, calibrated confidence and distribution-shift checks — and withholds outputs that aren't reliable enough to release.",
  badges: ["ABIDE-I fMRI", "Confidence-aware abstention", "Research prototype", "Python · Streamlit"],
  links: {
    repo: TS_REPO,
    readme: `${TS_REPO}/blob/main/README.md`,
  },
  pipeline: [
    { id: "data", title: "ABIDE-I data", short: "fMRI + ASD/control labels" },
    { id: "quality", title: "Quality checks", short: "FD, DVARS, SNR, coverage" },
    { id: "features", title: "Connectivity", short: "AAL atlas features" },
    { id: "prediction", title: "ASD prediction", short: "Calibrated confidence" },
    { id: "reliability", title: "Reliability", short: "Quality + distribution shift" },
    { id: "audit", title: "Trust & audit", short: "Abstention + Deferral Gap" },
  ],
  decisions: {
    trusted: { label: "Trusted", meaning: "Checks pass — released with its confidence and limits." },
    reviewed: { label: "Reviewed", meaning: "Warnings present — reasons shown for inspection." },
    withheld: { label: "Withheld", meaning: "Serious concern — no automatic prediction." },
  } satisfies Record<Decision, { label: string; meaning: string }>,

  /** Deferral Gap definition and the worked example from the project document. */
  deferralGap: {
    formula: "|ASD withheld % − control withheld %|",
    example: { asd: 12, control: 9, gap: 3 },
  },

  /** Cross-site (leave-one-site-out) evaluation metrics from the project document. */
  loso: {
    context: "One site held out at a time; reference statistics come from the rest.",
    metrics: [
      { name: "Coverage", meaning: "Scans not withheld" },
      { name: "Withholding rate", meaning: "Scans assigned Withheld" },
      { name: "Deferral Gap", meaning: "ASD vs control difference" },
      { name: "Released risk", meaning: "Error rate of released outputs" },
    ],
  },

  note: "Research prototype, not an autism diagnostic system. Model components and thresholds need validation, and a Trusted status is not a guarantee of correctness.",
} as const;

export const doctranslate = {
  title: "DocTranslate Enterprise",
  subtitle: "Privacy-Aware Document Translation",
  description:
    "A Flask application for translating business documents while masking personal data, enforcing terminology and keeping batch work visible.",
  stack: ["Python", "Flask", "MySQL", "spaCy", "pypdf", "python-docx"],
  links: {
    repo: DT_REPO,
    report: `${DT_REPO}/blob/main/IMPLEMENTATION_REPORT.md`,
    manual: `${DT_REPO}/blob/main/USER_MANUAL.md`,
  },
  pipeline: [
    { id: "upload", title: "Upload", detail: "DOCX, XLSX, XLS, PDF, TXT, CSV" },
    { id: "detect", title: "Detect", detail: "Names, emails, phones, IDs" },
    { id: "mask", title: "Mask PII", detail: "Swap in placeholders" },
    { id: "translate", title: "Translate", detail: "Only masked text is sent" },
    { id: "restore", title: "Restore", detail: "Map originals back" },
    { id: "export", title: "Export", detail: "Same format out" },
  ],
  highlights: [
    { title: "PII masking", body: "Sensitive values become placeholders before translation." },
    { title: "Glossary control", body: "Brand and do-not-translate terms stay intact." },
    { title: "Four engines", body: "Google, DeepL, Azure or LibreTranslate, when configured." },
    { title: "Batch & audit", body: "Queued jobs, notifications, history and audit logs." },
  ],
} as const;

/* ------------------------------------------------------------------------ */
/* Secondary projects                                                       */
/* ------------------------------------------------------------------------ */

export type ProjectStatus = "Concept" | "Prototype" | "Hackathon project" | "In progress" | "Completed";
export type ProjectVisualKind = "lifeledger" | "forecast";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  /** Omitted when the project's state hasn't been confirmed. */
  status?: ProjectStatus;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  /** false when the stack still needs confirming against the implementation. */
  techConfirmed: boolean;
  links: { repo: string | null; demo: string | null };
  image?: { src: string; alt: string };
  visual: ProjectVisualKind;
};

export const secondaryProjects: Project[] = [
  {
    slug: "lifeledger",
    title: "LifeLedger",
    subtitle: "Personal Life & Goal Management",
    summary: "A personal dashboard concept for organising goals, managing tasks and keeping everyday activities structured.",
    status: "Concept",
    problem: "Goals, tasks and daily routines tend to scatter across notes, apps and memory, which makes progress hard to see.",
    solution: "LifeLedger brings them into one dashboard with simple goal and task management and a clear overview.",
    features: ["Goal organisation", "Task management", "Structured daily activities", "Clear dashboard overview"],
    tech: ["HTML", "CSS", "JavaScript"],
    techConfirmed: false,
    links: { repo: null, demo: null },
    visual: "lifeledger",
  },
  {
    slug: "spare-parts-forecasting",
    title: "Spare Parts Demand Forecasting",
    subtitle: "SARIMA Time-Series Forecasting",
    summary: "Estimates spare-parts demand from historical data using a SARIMA time-series model.",
    problem: "Spare-parts demand changes over time with trends and seasonal patterns, so simple averages make poor stocking guides.",
    solution:
      "The project prepares historical demand as a time series, examines its trend and seasonality, and fits a SARIMA model to estimate future demand.",
    features: ["Data preparation of historical demand", "Trend and seasonality analysis", "SARIMA demand prediction"],
    tech: ["Python", "SARIMA"],
    techConfirmed: true,
    links: { repo: null, demo: null },
    visual: "forecast",
  },
];
