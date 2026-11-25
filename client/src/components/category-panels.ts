import type { CategoryKey } from "@/components/category-keys";
import type { CategoryPanelConfig } from "@/components/category-spotlight";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import wallStreetPrepLogo from "@assets/wall_street_prep_logo.webp";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import etsLogo from "@assets/ets_logo.webp";
import anthropicLogo from "@assets/anthropic_mark.png";
import googleLogo from "@assets/google_logo.svg";

/*
 * The four certification categories' "Inside the category" panels. Each takes its
 * look from the category's lead issuer: CFA Institute for Investment & Markets, CSI
 * for Advisory & Wealth Planning, Coursera for Quantitative & Statistical Methods, and
 * Google for Data & Business Intelligence.
 * Sources (Nov 2026):
 * - Wall Street Prep: the Financial & Valuation Modeling program covers three-statement
 *   modeling, DCF, trading and transaction comps, M&A and LBO in 7 courses (about 46
 *   hours), the program banks use to train new hires
 * - csi.ca: IFC prepares advisors to give mutual fund advice and meets the requirements
 *   to register to sell mutual funds; the CSC is the baseline requirement for securities,
 *   mutual funds and alternative funds transactions; PFSA turns each client's needs into
 *   credible plans; the CFSA is CSI's preferred credential for personal bankers; FP I
 *   gives comprehensive financial planning knowledge and leads toward the PFP designation;
 *   CSI has trained 500,000 learners since 1970
 * - CFA Institute: Level I topics and 300+ hours of study (see the CFA panel)
 * - Coursera course pages: Matrix Algebra for Engineers (HKUST, about 20 hours);
 *   Introduction to Calculus (Sydney, 5 modules, for science, engineering and commerce);
 *   Inferential Statistics (Duke, part of the five-course Statistics with R series);
 *   Econometrics: Methods and Applications (Erasmus, 8 modules from simple regression);
 *   Machine Learning (Stanford, Andrew Ng); Excel Skills for Business (Macquarie, four
 *   courses, about 107 hours); Python for Everybody (Michigan, gather, clean, analyze and
 *   visualize data); Learn SQL Basics for Data Science (UC Davis, filter, sort and
 *   summarize data, wrangling, A/B testing, Spark SQL); Data Visualization with Tableau
 *   (UC Davis with Tableau, business intelligence reports, a capstone for a company's
 *   leadership); Google Data Analytics (spreadsheets, SQL, R and Tableau)
 * - My site's certification list and certificates: years, and course counts
 */

/** A simple line mark on a rounded square, for the panel header. */
function mark(background: string, paths: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="${background}"/><g fill="none" stroke="rgb(255,255,255)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const categoryPanels: Record<CategoryKey, CategoryPanelConfig> = {
  invest: {
    theme: "role-spotlight--cat-invest",
    icon: mark("rgb(29,22,132)", '<path d="M12 33l8-9 6 5 10-12"/><path d="M29 17h7v7"/>'),
    title: "Investment & Markets",
    meta: "4 certifications · 2019–2026",
    display: "From market basics to the CFA Program.",
    lede: "Four credentials that trace how I learned the markets: Bloomberg's market concepts in 2019, financial and valuation modeling in 2020, DCF modeling in 2024, and now Level I of the CFA Program.",
    certs: [
      {
        name: "Bloomberg Market Concepts",
        issuer: "Bloomberg",
        year: "2019",
        logoSrc: bloombergLogo,
        body: "Economic indicators, currencies, fixed income and equities, taught on the Bloomberg Terminal.",
        chips: ["4 core modules", "On the Terminal"],
      },
      {
        name: "Financial & Valuation Modeling",
        issuer: "Wall Street Prep",
        year: "2020",
        logoSrc: wallStreetPrepLogo,
        body: "Three-statement models, DCF, trading and transaction comps, M&A and LBO, in the program banks use to train new hires.",
        chips: ["7 courses", "About 46 hrs"],
      },
      {
        name: "Discounted Cash Flow Analysis and Modeling",
        issuer: "Training The Street",
        year: "2024",
        logoSrc: trainingTheStreetLogo,
        body: "Building a DCF model step by step: forecasting free cash flow, discounting it and arriving at a value.",
        chips: ["DCF", "Excel"],
      },
      {
        name: "CFA Level I Candidate",
        issuer: "CFA Institute",
        year: "2026",
        logoSrc: cfaLogo,
        body: "Registered for Level I, which covers ten topics, from ethics and quantitative methods to equity, fixed income, derivatives and portfolio management.",
        chips: ["Level I", "Registered"],
      },
    ],
    band: {
      eyebrow: "The category",
      heading: "Markets, models, valuation, then the charter.",
      figures: [
        { to: 4, label: "credentials" },
        { to: 4, label: "issuers, from Bloomberg to CFA Institute" },
        { value: "2019–26", label: "from the first to the latest" },
        { to: 300, suffix: "+", label: "hours of study CFA Institute suggests for Level I" },
      ],
      note: "Three of the four have their own panels in Core credentials, with the details of each.",
    },
    path: {
      heading: "Learn the markets, model them, value them.",
      steps: [
        {
          title: "Markets",
          body: "Bloomberg Market Concepts: how economies, currencies, bonds and stocks move, learned on the Terminal.",
        },
        {
          title: "Modeling",
          body: "Wall Street Prep and Training The Street: three-statement, DCF and valuation models in Excel.",
        },
        {
          title: "The charter",
          body: "The CFA Program pulls it together, starting with Level I in 2026.",
        },
      ],
      done: "I'm registered for CFA Level I in 2026, the latest step on this path.",
    },
    certsHeading: "Four credentials, newest first.",
    footer: "Program facts come from Bloomberg, Wall Street Prep, Training The Street and CFA Institute (2026). Years are from my certificates.",
  },

  advisory: {
    theme: "role-spotlight--cat-advisory",
    icon: mark(
      "rgb(200,16,46)",
      '<circle cx="14" cy="33" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="34" cy="15" r="3"/><path d="M16.3 31l5.4-5M26.3 22l5.4-5"/>',
    ),
    title: "Advisory & Wealth Planning",
    meta: "5 certifications · 2020–2023",
    display: "Five CSI courses, from licensing to planning.",
    lede: "Between 2020 and 2023 I worked through the Canadian Securities Institute's path for advisors: the licensing courses for mutual funds and securities, then client advice, CSI's certificate for personal bankers, and financial planning.",
    certs: [
      {
        name: "Investment Funds in Canada",
        issuer: "Canadian Securities Institute",
        year: "2020",
        logoSrc: csiLogo,
        body: "Advice on mutual fund investments, based on a client's objectives, timeline and risk tolerance. It meets the requirements to register to sell mutual funds.",
        chips: ["IFC", "Mutual funds licence"],
      },
      {
        name: "Canadian Securities Course",
        issuer: "Canadian Securities Institute",
        year: "2021",
        logoSrc: csiLogo,
        body: "The baseline requirement for securities, mutual funds and alternative funds transactions in most financial services roles in Canada.",
        chips: ["CSC", "Two exams"],
      },
      {
        name: "Personal Financial Service Advice",
        issuer: "Canadian Securities Institute",
        year: "2021",
        logoSrc: csiLogo,
        body: "Turning each client's requirements, challenges and opportunities into credible plans that advance their financial position.",
        chips: ["PFSA", "Client advice"],
      },
      {
        name: "Certificate in Financial Services Advice",
        issuer: "Canadian Securities Institute",
        year: "2022",
        logoSrc: csiLogo,
        body: "CSI's certificate for advisors, which it calls the preferred credential for personal bankers.",
        chips: ["CFSA", "Certificate"],
      },
      {
        name: "Financial Planning 1",
        issuer: "Canadian Securities Institute",
        year: "2023",
        logoSrc: csiLogo,
        body: "Comprehensive financial planning knowledge for analyzing a client's plan, and a step toward CSI's Personal Financial Planner designation.",
        chips: ["FP I", "Planning"],
      },
    ],
    band: {
      eyebrow: "Canadian Securities Institute",
      heading: "One institute, one path.",
      figures: [
        { to: 5, label: "CSI courses and certificates" },
        { value: "2020–23", label: "from the first to the last" },
        { to: 500000, label: "learners CSI has trained" },
        { value: "1970", label: "when CSI began training Canada's financial industry" },
      ],
      note: "The Canadian Securities Course has its own panel in Core credentials, with both exams and my result.",
    },
    path: {
      heading: "Licensed, then advising, then planning.",
      steps: [
        {
          title: "Licensing",
          body: "The IFC and the CSC: the courses expected before you sell mutual funds or securities in Canada.",
        },
        {
          title: "Advice",
          body: "PFSA and the CFSA: plans built around each client's needs, the standard CSI sets for personal bankers.",
        },
        {
          title: "Planning",
          body: "FP I: comprehensive financial planning, and the first step toward CSI's Personal Financial Planner designation.",
        },
      ],
      done: "I completed all five between 2020 and 2023.",
    },
    certsHeading: "Five courses, newest first.",
    footer: "Course facts come from csi.ca (2026). Years are from my CSI certificates.",
  },

  quant: {
    theme: "role-spotlight--cat-quant",
    icon: mark("rgb(0,86,210)", '<path d="M33 14H15l9 10-9 10h18"/>'),
    title: "Quantitative & Statistical Methods",
    meta: "7 certifications · 2020–2024",
    display: "The math behind the models.",
    lede: "Seven credentials in the methods finance runs on: calculus and matrix algebra, inferential statistics and econometrics, machine learning and Excel modeling, plus a 170 on the GRE's quantitative section.",
    certs: [
      {
        name: "Machine Learning",
        issuer: "Stanford University · Coursera",
        year: "2020",
        logoSrc: courseraLogo,
        body: "Andrew Ng's broad introduction to machine learning, data mining and statistical pattern recognition.",
        chips: ["Stanford"],
      },
      {
        name: "Excel Skills for Business",
        issuer: "Macquarie University · Coursera",
        year: "2020",
        logoSrc: courseraLogo,
        body: "Four courses from essentials to advanced: formulas, dashboards and complex calculations in Excel.",
        chips: ["4 courses", "About 107 hrs"],
      },
      {
        name: "Econometrics: Methods and Applications",
        issuer: "Erasmus University Rotterdam · Coursera",
        year: "2022",
        logoSrc: courseraLogo,
        body: "Regression and the econometric methods behind economic and financial data, building up from simple regression.",
        chips: ["8 modules"],
      },
      {
        name: "Inferential Statistics",
        issuer: "Duke University · Coursera",
        year: "2023",
        logoSrc: courseraLogo,
        body: "Statistical inference with R, from Duke's five-course Statistics with R series.",
        chips: ["R"],
      },
      {
        name: "Introduction to Calculus",
        issuer: "The University of Sydney · Coursera",
        year: "2023",
        logoSrc: courseraLogo,
        body: "The foundations of calculus for science, engineering and commerce, with its key ideas and history.",
        chips: ["5 modules"],
      },
      {
        name: "Matrix Algebra for Engineers",
        issuer: "HKUST · Coursera",
        year: "2024",
        logoSrc: courseraLogo,
        body: "The linear algebra an engineer should know: matrices, determinants, eigenvalues and diagonalization.",
        chips: ["About 20 hrs"],
      },
      {
        name: "GRE General Test",
        issuer: "ETS",
        year: "2024",
        logoSrc: etsLogo,
        body: "328 overall, with a perfect 170 in Quantitative Reasoning.",
        chips: ["170 Quant", "328 total"],
      },
    ],
    band: {
      eyebrow: "Coursera and ETS",
      heading: "Six universities and one testing body.",
      figures: [
        { to: 7, label: "credentials" },
        { to: 6, label: "universities, through Coursera" },
        { value: "2020–24", label: "from the first to the latest" },
        { to: 170, label: "my GRE Quantitative score, the top of the scale" },
      ],
      note: "Six of the seven came through Coursera, from Stanford, Macquarie, Erasmus, Duke, Sydney and HKUST. The GRE has its own panel in Core credentials.",
    },
    path: {
      heading: "Foundations, inference, prediction.",
      steps: [
        {
          title: "Foundations",
          body: "Calculus and matrix algebra, the language most quantitative methods are written in.",
        },
        {
          title: "Inference",
          body: "Inferential statistics and econometrics: testing ideas against data and estimating relationships.",
        },
        {
          title: "Prediction",
          body: "Machine learning and Excel modeling: turning data into forecasts and decisions.",
        },
      ],
      done: "In 2024 I scored 170 on the GRE's Quantitative Reasoning section, the top of the scale.",
    },
    certsHeading: "Seven credentials, newest first.",
    footer: "Course facts come from Coursera and ets.org (2026). Years are from my certificates and score report.",
  },

  data: {
    theme: "role-spotlight--cat-data",
    icon: mark("rgb(25,103,210)", '<path d="M15 33v-8M24 33V15M33 33V21"/>'),
    title: "Data & Business Intelligence",
    meta: "5 certifications · 2021–2026",
    display: "From raw data to decisions, and now AI.",
    lede: "Five programs covering an analyst's toolkit: Google's data analytics certificate, Python, SQL and Tableau specializations, and Anthropic's AI Fluency course.",
    certs: [
      {
        name: "Google Data Analytics Professional Certificate",
        issuer: "Google · Coursera",
        year: "2021",
        logoSrc: googleLogo,
        body: "Cleaning, analyzing and visualizing data with spreadsheets, SQL, R and Tableau, built for entry-level analyst roles.",
        chips: ["8 courses"],
      },
      {
        name: "Python for Everybody",
        issuer: "University of Michigan · Coursera",
        year: "2022",
        logoSrc: courseraLogo,
        body: "Programs that gather, clean, analyze and visualize data, from data structures to web APIs and databases.",
        chips: ["5 courses"],
      },
      {
        name: "Learn SQL Basics for Data Science",
        issuer: "UC Davis · Coursera",
        year: "2023",
        logoSrc: courseraLogo,
        body: "Filtering, sorting and summarizing data with SQL, then data wrangling, A/B testing and Spark SQL.",
        chips: ["4 courses"],
      },
      {
        name: "Data Visualization with Tableau",
        issuer: "UC Davis · Coursera",
        year: "2023",
        logoSrc: courseraLogo,
        body: "Business intelligence reports and dashboards in Tableau, ending in a capstone for a company's leadership.",
        chips: ["Made with Tableau"],
      },
      {
        name: "AI Fluency: Framework and Foundations",
        issuer: "Anthropic",
        year: "2026",
        logoSrc: anthropicLogo,
        body: "The 4D framework for working with AI: delegation, description, discernment and diligence.",
        chips: ["4Ds"],
      },
    ],
    band: {
      eyebrow: "The toolkit",
      heading: "Spreadsheets, SQL, Python, Tableau and AI.",
      figures: [
        { to: 5, label: "programs" },
        { to: 17, label: "courses in the Google, Python and SQL programs" },
        { to: 4, label: "issuers: Google, Michigan, UC Davis and Anthropic" },
        { value: "2021–26", label: "from the first to the latest" },
      ],
      note: "Four of the five came through Coursera. AI Fluency has its own panel in Core credentials.",
    },
    path: {
      heading: "Get the data, analyze it, share it.",
      steps: [
        {
          title: "Get the data",
          body: "SQL and Python: querying databases, calling web APIs and cleaning what comes back.",
        },
        {
          title: "Analyze",
          body: "Google's certificate: cleaning, analyzing and checking data with spreadsheets, SQL and R.",
        },
        {
          title: "Share",
          body: "Tableau dashboards for decision-makers, and AI used with judgment.",
        },
      ],
      done: "I finished Google's certificate in 2021 and AI Fluency in 2026.",
    },
    certsHeading: "Five programs, newest first.",
    footer: "Program facts come from Coursera, Google and Anthropic (2026). Years and course counts are from my certificates.",
  },
};
