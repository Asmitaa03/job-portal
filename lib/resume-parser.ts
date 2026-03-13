/**
 * Extract plain text from resume files (PDF or TXT) for ATS scoring.
 * Used by the applications API to parse uploaded resumes.
 */

export type ResumeParseResult = {
  text: string;
  error?: string;
};

/**
 * Extract text from a resume file buffer.
 * Supports PDF (via pdf-parse) and plain text.
 * Returns empty string and logs error if PDF parsing fails (e.g. image-based PDF).
 */
export async function extractResumeText(
  buffer: Buffer,
  mimeType: string,
  fileName?: string
): Promise<ResumeParseResult> {
  const isPdf =
    mimeType === "application/pdf" ||
    (fileName && fileName.toLowerCase().endsWith(".pdf"));

  if (isPdf) {
    try {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      const text = (textResult?.text ?? "").trim();
      await parser.destroy();
      return { text: text || "" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF parse failed";
      console.warn("Resume PDF parsing failed:", message);
      return { text: "", error: message };
    }
  }

  // Plain text
  const isText =
    mimeType === "text/plain" ||
    (fileName && fileName.toLowerCase().endsWith(".txt"));
  if (isText) {
    const text = buffer.toString("utf-8").trim();
    return { text };
  }

  return { text: "", error: "Unsupported file type" };
}
