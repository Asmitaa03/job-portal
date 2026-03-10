/**
 * ATS (Applicant Tracking System) Scoring Algorithm
 * Calculates compatibility score based on job requirements vs resume content
 */

interface ATSResult {
  score: number;
  breakdown: {
    skills: number;
    experience: number;
    keywords: number;
    softSkills?: number;
  };
  matchedKeywords?: string[];
  missingKeywords?: string[];
  recommendations?: string[];
}

const STOPWORDS = new Set([
  "and","the","with","from","that","this","have","will","been","also",
  "like","make","made","work","over","into","used","able","while","such",
  "using","including","through","across","about","your","their","our"
]);

const SYNONYMS: Record<string, string> = {
  js: "javascript",
  reactjs: "react",
  nodejs: "node",
  "aws cloud": "aws",
  k8s: "kubernetes",
};

const PRIORITY_HINTS: Array<{ hint: RegExp; weight: number }> = [
  { hint: /must\s*have|required/gi, weight: 2.0 },
  { hint: /preferred|strong(ly)?\s*preferred|bonus/gi, weight: 1.3 },
  { hint: /nice\s*to\s*have/gi, weight: 1.1 },
];

const SOFT_SKILLS = [
  "communication","leadership","teamwork","collaboration","ownership",
  "adaptability","problem","problem-solving","mentorship","stakeholder"
];

export function calculateATSScore(
  resumeText: string,
  jobRequirements: string,
  jobDescription: string,
  experienceYears: number = 0
): ATSResult {
  const resumeNorm = normalize(resumeText);
  const jobNorm = normalize(jobRequirements + "\n" + jobDescription);

  const jobTokens = extractKeywords(jobNorm);
  const resumeTokens = extractKeywords(resumeNorm);

  const jobNgrams = buildNgrams(jobNorm);
  const resumeNgrams = buildNgrams(resumeNorm);

  const jobTerms = dedupe([...jobTokens, ...jobNgrams]);
  const resumeTerms = dedupe([...resumeTokens, ...resumeNgrams]);

  const { matched, missing, keywordScore } = weightedMatch(jobNorm, jobTerms, resumeTerms);
  const softSkillScore = calcSoftSkillScore(resumeNorm);
  const experienceScore = calculateExperienceScoreImproved(experienceYears, jobNorm);
  const skillsScore = keywordScore;

  const totalScore = Math.round(
    skillsScore * 0.45 +
    experienceScore * 0.25 +
    softSkillScore * 0.10 +
    (matched.length / Math.max(jobTerms.length, 1)) * 0.20 * 100
  );

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      keywords: Math.round((matched.length / Math.max(jobTerms.length, 1)) * 100),
      softSkills: Math.round(softSkillScore),
    },
    matchedKeywords: matched.slice(0, 50),
    missingKeywords: missing.slice(0, 50),
    recommendations: missing.slice(0, 10),
  };
}

function normalize(text: string): string {
  let t = text.toLowerCase();
  for (const key in SYNONYMS) {
    t = t.replace(new RegExp(key, "g"), SYNONYMS[key]);
  }
  return t;
}

function extractKeywords(text: string): string[] {
  const words = text.split(/\W+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return dedupe(words);
}

function buildNgrams(text: string): string[] {
  const tokens = text.split(/\W+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  const bigrams: string[] = [];
  const trigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(tokens[i] + " " + tokens[i + 1]);
  }
  for (let i = 0; i < tokens.length - 2; i++) {
    trigrams.push(tokens[i] + " " + tokens[i + 1] + " " + tokens[i + 2]);
  }
  return dedupe([...bigrams, ...trigrams]).filter((t) => t.length <= 40);
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)];
}

function weightedMatch(jobText: string, jobTerms: string[], resumeTerms: string[]): {
  matched: string[];
  missing: string[];
  keywordScore: number;
} {
  if (jobTerms.length === 0) return { matched: [], missing: [], keywordScore: 100 };

  const termToWeight = new Map<string, number>();
  const totalWeights = jobTerms.reduce((acc, term) => {
    const freq = occurrences(jobText, term);
    const priorityBoost = PRIORITY_HINTS.reduce((w, p) => (p.hint.test(jobText) ? w * p.weight : w), 1);
    const weight = Math.max(1, freq) * priorityBoost;
    termToWeight.set(term, weight);
    return acc + weight;
  }, 0);

  let matchedWeight = 0;
  const matched: string[] = [];
  const missing: string[] = [];

  for (const term of jobTerms) {
    const has = resumeTerms.some((rt) => rt.includes(term) || term.includes(rt));
    if (has) {
      matched.push(term);
      matchedWeight += termToWeight.get(term) || 1;
    } else {
      missing.push(term);
    }
  }

  const keywordScore = Math.round((matchedWeight / Math.max(totalWeights, 1)) * 100);
  return { matched, missing, keywordScore };
}

function occurrences(text: string, term: string): number {
  if (!term) return 0;
  const re = new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi");
  const m = text.match(re);
  return m ? m.length : 0;
}

function calcSoftSkillScore(text: string): number {
  let hits = 0;
  for (const s of SOFT_SKILLS) {
    if (text.includes(s)) hits++;
  }
  return (hits / SOFT_SKILLS.length) * 100;
}

function calculateExperienceScoreImproved(years: number, jobText: string): number {
  const yearMatches = jobText.match(/(\d+)\+?\s*(years?|yrs?|yr)/gi);
  if (!yearMatches) return 100;
  const nums = yearMatches.map(m => parseInt(m.match(/\d+/)![0])).filter(n => !isNaN(n));
  if (nums.length === 0) return 100;
  const avgReq = nums.reduce((a,b)=>a+b,0) / nums.length;
  if (years >= avgReq) return 100;
  if (years >= avgReq * 0.9) return 92;
  if (years >= avgReq * 0.75) return 80;
  if (years >= avgReq * 0.5) return 60;
  return 35;
}

// Similarity helpers kept for potential future fuzzy matching (not used directly now)

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Extract basic info from resume text
 */
export function parseResume(resumeText: string): {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
} {
  const text = resumeText;

  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // Extract years of experience
  const experienceMatch = text.match(/(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?experience/gi);
  let experienceYears = 0;
  if (experienceMatch) {
    const years = experienceMatch.map(m => parseInt(m.match(/\d+/)![0]));
    experienceYears = Math.max(...years);
  }

  // Extract skills
  const skills = extractKeywords(normalize(text));

  return {
    email,
    phone,
    skills: skills.slice(0, 20), // Limit to top 20
    experienceYears,
  };
}

