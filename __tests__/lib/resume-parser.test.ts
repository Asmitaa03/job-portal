import { describe, it, expect } from "vitest";
import { extractResumeText } from "@/lib/resume-parser";

describe("extractResumeText", () => {
  it("extracts text from plain text buffer", async () => {
    const content = "John Doe\nSoftware Engineer\n5 years experience";
    const buffer = Buffer.from(content, "utf-8");
    const result = await extractResumeText(buffer, "text/plain", "resume.txt");
    expect(result.text).toBe(content);
    expect(result.error).toBeUndefined();
  });

  it("returns empty text and no error for unsupported type when file has unknown extension", async () => {
    const buffer = Buffer.from("test");
    const result = await extractResumeText(buffer, "application/octet-stream", "file.xyz");
    expect(result.text).toBe("");
    expect(result.error).toBe("Unsupported file type");
  });

  it("treats .txt file as text even without mime", async () => {
    const content = "Resume content here";
    const buffer = Buffer.from(content, "utf-8");
    const result = await extractResumeText(buffer, "application/octet-stream", "resume.txt");
    expect(result.text).toBe(content);
  });
});
