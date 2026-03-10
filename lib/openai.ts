import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ResumeSummary = {
  name?: string;
  email?: string;
  phone?: string;
  experienceYears?: number;
  skills?: string[];
  projects?: { title?: string; bullets?: string[]; tech?: string[] }[];
  summary?: string;
  missingKeywords?: string[];
  atsScore?: number;
};

export async function summarizeResumeWithOpenAI(args: {
  resumeText: string;
  jobDescription?: string;
}): Promise<ResumeSummary> {
  const { resumeText, jobDescription } = args;
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are an assistant that extracts structured JSON from resumes. Return ONLY valid JSON conforming to the provided schema. Do not include any extra keys.",
    },
    {
      role: "user",
      content: `Extract this resume into the following JSON schema. If a field is unknown, omit it.
Schema:
{
  "name": string,
  "email": string,
  "phone": string,
  "experienceYears": number,
  "skills": string[],
  "projects": [{"title": string, "bullets": string[], "tech": string[]}],
  "summary": string,
  "missingKeywords": string[],
  "atsScore": number
}

Resume Text:\n${resumeText}
${jobDescription ? `\nJob Description:\n${jobDescription}` : ""}
`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    response_format: { type: "json_object" },
    temperature: 0,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content) as ResumeSummary;
  } catch {
    return {} as ResumeSummary;
  }
}


