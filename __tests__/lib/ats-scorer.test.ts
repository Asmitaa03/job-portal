import { describe, it, expect } from "vitest";
import { calculateATSScore, parseResume } from "@/lib/ats-scorer";

describe("calculateATSScore", () => {
  it("returns a score between 0 and 100", () => {
    const result = calculateATSScore(
      "React developer with 5 years experience",
      "Required: React, TypeScript, 3+ years experience",
      "We build web apps with React."
    );
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("gives higher score when resume matches job requirements", () => {
    const strongMatch = calculateATSScore(
      "Senior React and TypeScript developer with 5 years of experience. Led teams, strong communication.",
      "Required: React, TypeScript. 3+ years experience. Preferred: leadership.",
      "Building React applications."
    );
    const weakMatch = calculateATSScore(
      "Intern with no experience",
      "Required: React, TypeScript. 3+ years experience.",
      "Building React applications."
    );
    expect(strongMatch.score).toBeGreaterThan(weakMatch.score);
  });

  it("returns breakdown with skills, experience, keywords, softSkills", () => {
    const result = calculateATSScore(
      "Developer with React and JavaScript. 2 years experience.",
      "Required: React, JavaScript. 1+ years.",
      "Job description here."
    );
    expect(result.breakdown).toBeDefined();
    expect(typeof result.breakdown.skills).toBe("number");
    expect(typeof result.breakdown.experience).toBe("number");
    expect(typeof result.breakdown.keywords).toBe("number");
    expect(result.matchedKeywords).toBeDefined();
    expect(Array.isArray(result.matchedKeywords)).toBe(true);
  });
});

describe("parseResume", () => {
  it("extracts email from resume text", () => {
    const text = "John Doe\nContact: john.doe@example.com\nExperience: 3 years";
    const parsed = parseResume(text);
    expect(parsed.email).toBe("john.doe@example.com");
  });

  it("extracts years of experience", () => {
    const text = "I have 5 years of experience in software development.";
    const parsed = parseResume(text);
    expect(parsed.experienceYears).toBe(5);
  });

  it("returns skills array (keyword extraction)", () => {
    const text = "Skills: JavaScript, React, Node.js, and TypeScript.";
    const parsed = parseResume(text);
    expect(Array.isArray(parsed.skills)).toBe(true);
    expect(parsed.skills.length).toBeGreaterThan(0);
  });

  it("returns 0 experience when none mentioned", () => {
    const parsed = parseResume("No experience mentioned here.");
    expect(parsed.experienceYears).toBe(0);
  });
});
