/*
 * The text on each panel's "+" button. It lives here, apart from the panels, so the
 * button can show before its panel's code has loaded (see lazy-spotlight.tsx).
 */

export interface SpotlightTriggerText {
  label: string;
  hint: string;
}

const role = "Inside the role";
const credential = "Inside the credential";
const category = "Inside the category";

export const spotlightTriggers = {
  "73-strings": { label: role, hint: "Clients, platform and day-to-day" },
  roi: { label: role, hint: "The app, my work and the OpenAI deal" },
  bmo: { label: role, hint: "The team, the clients and my work" },
  td: { label: role, hint: "The branch, the clients and my results" },
  "rbc-advisor": { label: role, hint: "The bank, the clients and my results" },
  "rbc-intern": { label: role, hint: "The branch, the clients and my results" },
  "rbc-ambassador": { label: role, hint: "The campus, the events and my results" },
  irving: { label: role, hint: "The customers, the research and my results" },
  "grant-thornton": { label: role, hint: "The firm, the returns and my results" },
  unb: { label: "Inside the degree", hint: "The university, the program and my results" },
  cfa: { label: credential, hint: "The program, the exam and my status" },
  tts: { label: credential, hint: "The firm, the model and my certificate" },
  csi: { label: credential, hint: "The institute, the exams and my result" },
  bbg: { label: credential, hint: "The course, the Terminal and my result" },
  ets: { label: credential, hint: "The test, my scores and how they compare" },
  aif: { label: credential, hint: "The framework, the course and the series" },
  "cat-invest": { label: category, hint: "From market basics to the CFA Program" },
  "cat-advisory": { label: category, hint: "CSI's path, from licensing to planning" },
  "cat-quant": { label: category, hint: "The math, the statistics and the models" },
  "cat-data": { label: category, hint: "From spreadsheets to SQL, Python, Tableau and AI" },
  "united-way": { label: role, hint: "The campaign, my results and United Way’s work" },
  "irving-volunteer": { label: role, hint: "The event, the kids and how Irving gives back" },
} satisfies Record<string, SpotlightTriggerText>;
