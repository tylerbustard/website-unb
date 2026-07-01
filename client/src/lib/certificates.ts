import { slugify } from "@/lib/utils";

export interface CertificateAsset {
  /** Root-absolute path to the optimized preview image in client/public/certificates. */
  image: string;
  /** Descriptive alt text for the certificate image. */
  alt: string;
}

/**
 * Certificate preview images, keyed by slugify(certification name).
 * Only credentials with a real certificate file appear here; anything absent
 * simply renders without a "View Certificate" button. Add entries (and drop the
 * image in client/public/certificates/) as more certificates become available.
 */
export const certificateAssets: Record<string, CertificateAsset> = {
  "cfa-level-i-candidate": { image: "/certificates/cfa-level-i-candidate.webp", alt: "CFA Level I Candidate certificate from CFA Institute" },
  "discounted-cash-flow-analysis-and-modeling": { image: "/certificates/discounted-cash-flow-analysis-and-modeling.webp", alt: "Discounted Cash Flow Analysis and Modeling certificate from Training The Street" },
  "financial---valuation-modeling": { image: "/certificates/financial---valuation-modeling.webp", alt: "Financial & Valuation Modeling certificate from Wall Street Prep" },
  "bloomberg-market-concepts-certificate": { image: "/certificates/bloomberg-market-concepts-certificate.webp", alt: "Bloomberg Market Concepts Certificate certificate from Bloomberg" },
  "canadian-securities-course": { image: "/certificates/canadian-securities-course.webp", alt: "Canadian Securities Course certificate from Canadian Securities Institute" },
  "investment-funds-in-canada": { image: "/certificates/investment-funds-in-canada.webp", alt: "Investment Funds in Canada certificate from Canadian Securities Institute" },
  "personal-finance-essentials": { image: "/certificates/personal-finance-essentials.webp", alt: "Personal Finance Essentials certificate from McGill University" },
  "claude-code-101": { image: "/certificates/claude-code-101.webp", alt: "Claude Code 101 certificate from Anthropic Academy" },
  "claude-code-in-action": { image: "/certificates/claude-code-in-action.webp", alt: "Claude Code in Action certificate from Anthropic Academy" },
  "introduction-to-subagents": { image: "/certificates/introduction-to-subagents.webp", alt: "Introduction to subagents certificate from Anthropic Academy" },
  "introduction-to-agent-skills": { image: "/certificates/introduction-to-agent-skills.webp", alt: "Introduction to agent skills certificate from Anthropic Academy" },
  "building-with-the-claude-api": { image: "/certificates/building-with-the-claude-api.webp", alt: "Building with the Claude API certificate from Anthropic Academy" },
  "introduction-to-model-context-protocol": { image: "/certificates/introduction-to-model-context-protocol.webp", alt: "Introduction to Model Context Protocol certificate from Anthropic Academy" },
  "claude-with-amazon-bedrock": { image: "/certificates/claude-with-amazon-bedrock.webp", alt: "Claude with Amazon Bedrock certificate from Anthropic Academy" },
  "claude-with-google-cloud-s-vertex-ai": { image: "/certificates/claude-with-google-cloud-s-vertex-ai.webp", alt: "Claude with Google Cloud's Vertex AI certificate from Anthropic Academy" },
  "claude-101": { image: "/certificates/claude-101.webp", alt: "Claude 101 certificate from Anthropic Academy" },
  "ai-capabilities-and-limitations": { image: "/certificates/ai-capabilities-and-limitations.webp", alt: "AI Capabilities and Limitations certificate from Anthropic Academy" },
  "ai-fluency--framework---foundations": { image: "/certificates/ai-fluency--framework---foundations.webp", alt: "AI Fluency: Framework & Foundations certificate from Anthropic Academy" },
  "ai-fluency-for-educators": { image: "/certificates/ai-fluency-for-educators.webp", alt: "AI Fluency for educators certificate from Anthropic Academy" },
  "ai-fluency-for-students": { image: "/certificates/ai-fluency-for-students.webp", alt: "AI Fluency for students certificate from Anthropic Academy" },
  "teaching-ai-fluency": { image: "/certificates/teaching-ai-fluency.webp", alt: "Teaching AI Fluency certificate from Anthropic Academy" },
  "ai-fluency-for-nonprofits": { image: "/certificates/ai-fluency-for-nonprofits.webp", alt: "AI Fluency for nonprofits certificate from Anthropic Academy" },
  "ai-fluency-for-small-businesses": { image: "/certificates/ai-fluency-for-small-businesses.webp", alt: "AI Fluency for Small Businesses certificate from Anthropic Academy" },
  "introduction-to-claude-cowork": { image: "/certificates/introduction-to-claude-cowork.webp", alt: "Introduction to Claude Cowork certificate from Anthropic Academy" },
  "university-of-new-brunswick": { image: "/certificates/university-of-new-brunswick.webp", alt: "University of New Brunswick diploma — Bachelor of Business Administration in Finance" },
  "northeast-christian-college": { image: "/certificates/northeast-christian-college.webp", alt: "Northeast Christian College Certificate of Theology" },
// listed button-adds
  "data-visualization-with-tableau": { image: "/certificates/data-visualization-with-tableau.webp", alt: "Data Visualization with Tableau certificate from UC Davis" },
  "sql-for-data-science": { image: "/certificates/sql-for-data-science.webp", alt: "SQL for Data Science certificate from UC Davis" },
  "power-bi-data-visualization": { image: "/certificates/power-bi-data-visualization.webp", alt: "Power BI Data Visualization certificate from Microsoft" },
  "econometrics--methods---applications": { image: "/certificates/econometrics--methods---applications.webp", alt: "Econometrics: Methods & Applications certificate from Erasmus University" },
  "matrix-algebra-for-engineers": { image: "/certificates/matrix-algebra-for-engineers.webp", alt: "Matrix Algebra for Engineers certificate from HKUST" },
  "introduction-to-calculus": { image: "/certificates/introduction-to-calculus.webp", alt: "Introduction to Calculus certificate from University of Sydney" },
  "machine-learning": { image: "/certificates/machine-learning.webp", alt: "Machine Learning certificate from Stanford University" },
  "inferential-statistics": { image: "/certificates/inferential-statistics.webp", alt: "Inferential Statistics certificate from Duke University" },
  "excel-skills-for-business": { image: "/certificates/excel-skills-for-business.webp", alt: "Excel Skills for Business certificate from Macquarie University" },
// new certs
  "cfa-institute-investment-foundations": { image: "/certificates/cfa-institute-investment-foundations.webp", alt: "CFA Institute Investment Foundations certificate from CFA Institute" },
  "financial-risk-and-regulation--frr": { image: "/certificates/financial-risk-and-regulation--frr.webp", alt: "Financial Risk and Regulation (FRR) certificate from Global Association of Risk Professionals" },
  "ibm-data-analyst-professional-certificate": { image: "/certificates/ibm-data-analyst-professional-certificate.webp", alt: "IBM Data Analyst Professional Certificate certificate from IBM" },
  "foundations--data--data--everywhere": { image: "/certificates/foundations--data--data--everywhere.webp", alt: "Foundations: Data, Data, Everywhere certificate from Google" },
  "ask-questions-to-make-data-driven-decisions": { image: "/certificates/ask-questions-to-make-data-driven-decisions.webp", alt: "Ask Questions to Make Data-Driven Decisions certificate from Google" },
  "prepare-data-for-exploration": { image: "/certificates/prepare-data-for-exploration.webp", alt: "Prepare Data for Exploration certificate from Google" },
  "process-data-from-dirty-to-clean": { image: "/certificates/process-data-from-dirty-to-clean.webp", alt: "Process Data from Dirty to Clean certificate from Google" },
  "analyze-data-to-answer-questions": { image: "/certificates/analyze-data-to-answer-questions.webp", alt: "Analyze Data to Answer Questions certificate from Google" },
  "google-analytics-certification": { image: "/certificates/google-analytics-certification.webp", alt: "Google Analytics Certification certificate from Google" },
  "microsoft-certified--power-bi-data-analyst-associate": { image: "/certificates/microsoft-certified--power-bi-data-analyst-associate.webp", alt: "Microsoft Certified: Power BI Data Analyst Associate certificate from Microsoft" },
  "microsoft-office-specialist--excel-associate": { image: "/certificates/microsoft-office-specialist--excel-associate.webp", alt: "Microsoft Office Specialist: Excel Associate certificate from Microsoft" },
  "microsoft-certified--azure-ai-engineer-associate": { image: "/certificates/microsoft-certified--azure-ai-engineer-associate.webp", alt: "Microsoft Certified: Azure AI Engineer Associate certificate from Microsoft" },
  "microsoft-certified--azure-data-scientist-associate": { image: "/certificates/microsoft-certified--azure-data-scientist-associate.webp", alt: "Microsoft Certified: Azure Data Scientist Associate certificate from Microsoft" },
  "microsoft-certified--azure-data-engineer-associate": { image: "/certificates/microsoft-certified--azure-data-engineer-associate.webp", alt: "Microsoft Certified: Azure Data Engineer Associate certificate from Microsoft" },
  "microsoft-certified--azure-developer-associate": { image: "/certificates/microsoft-certified--azure-developer-associate.webp", alt: "Microsoft Certified: Azure Developer Associate certificate from Microsoft" },
  "microsoft-certified--azure-ai-fundamentals": { image: "/certificates/microsoft-certified--azure-ai-fundamentals.webp", alt: "Microsoft Certified: Azure AI Fundamentals certificate from Microsoft" },
  "microsoft-certified--azure-data-fundamentals": { image: "/certificates/microsoft-certified--azure-data-fundamentals.webp", alt: "Microsoft Certified: Azure Data Fundamentals certificate from Microsoft" },
  "microsoft-certified--azure-fundamentals": { image: "/certificates/microsoft-certified--azure-fundamentals.webp", alt: "Microsoft Certified: Azure Fundamentals certificate from Microsoft" },
  "pcap--certified-associate-in-python-programming": { image: "/certificates/pcap--certified-associate-in-python-programming.webp", alt: "PCAP: Certified Associate in Python Programming certificate from Python Institute" },
  "pcep--certified-entry-level-python-programmer": { image: "/certificates/pcep--certified-entry-level-python-programmer.webp", alt: "PCEP: Certified Entry-Level Python Programmer certificate from Python Institute" },
  "programming-for-everybody--python": { image: "/certificates/programming-for-everybody--python.webp", alt: "Programming for Everybody (Python) certificate from University of Michigan" },
  "python-data-structures": { image: "/certificates/python-data-structures.webp", alt: "Python Data Structures certificate from University of Michigan" },
  "using-python-to-access-web-data": { image: "/certificates/using-python-to-access-web-data.webp", alt: "Using Python to Access Web Data certificate from University of Michigan" },
  "using-databases-with-python": { image: "/certificates/using-databases-with-python.webp", alt: "Using Databases with Python certificate from University of Michigan" },
  "capstone--retrieving--processing---visualizing-data-with-python": { image: "/certificates/capstone--retrieving--processing---visualizing-data-with-python.webp", alt: "Capstone: Retrieving, Processing & Visualizing Data with Python certificate from University of Michigan" },
  "inbound-marketing-certification": { image: "/certificates/inbound-marketing-certification.webp", alt: "Inbound Marketing Certification certificate from HubSpot Academy" },
  "ama-pcm-digital-marketing": { image: "/certificates/ama-pcm-digital-marketing.webp", alt: "AMA PCM Digital Marketing certificate from American Marketing Association" },
  "google-ads-measurement-certification": { image: "/certificates/google-ads-measurement-certification.webp", alt: "Google Ads Measurement Certification certificate from Google" },
  "google-ads-search-certification": { image: "/certificates/google-ads-search-certification.webp", alt: "Google Ads Search Certification certificate from Google" },
  "shrm-certified-professional--shrm-cp": { image: "/certificates/shrm-certified-professional--shrm-cp.webp", alt: "SHRM Certified Professional (SHRM-CP) certificate from SHRM" },
  "cphr-canada": { image: "/certificates/cphr-canada.webp", alt: "CPHR Canada certificate from CPHR Canada" },
  "hrci-professional-in-human-resources---international--phri": { image: "/certificates/hrci-professional-in-human-resources---international--phri.webp", alt: "HRCI Professional in Human Resources – International (PHRi) certificate from HR Certification Institute" },
  "certified-associate-in-project-management--capm": { image: "/certificates/certified-associate-in-project-management--capm.webp", alt: "Certified Associate in Project Management (CAPM) certificate from Project Management Institute" },
  "certified-scrummaster--csm": { image: "/certificates/certified-scrummaster--csm.webp", alt: "Certified ScrumMaster (CSM) certificate from Scrum Alliance" },
  "certificate-in-effective-teaching": { image: "/certificates/certificate-in-effective-teaching.webp", alt: "Certificate in Effective Teaching certificate from Association of College and University Educators" },
  "microsoft-certified-educator": { image: "/certificates/microsoft-certified-educator.webp", alt: "Microsoft Certified Educator certificate from Microsoft" },
  "gre-general-test": { image: "/certificates/gre-general-test.webp", alt: "GRE General Test score report from ETS" },
  "derivatives-fundamentals-course--dfc": { image: "/certificates/derivatives-fundamentals-course--dfc.webp", alt: "Derivatives Fundamentals Course certificate from the Canadian Securities Institute" },
};

/** Look up a certificate/diploma preview by a certification, institution, or organization display name. */
export function getCertificateAsset(name: string): CertificateAsset | undefined {
  return certificateAssets[slugify(name)];
}
