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
};

/** Look up a certificate/diploma preview by a certification, institution, or organization display name. */
export function getCertificateAsset(name: string): CertificateAsset | undefined {
  return certificateAssets[slugify(name)];
}
