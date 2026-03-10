import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateATSScore } from "@/lib/ats-scorer";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { sampleApplications } from "@/lib/sample-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;

    let applications = [] as any[];
    try {
      applications = await prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              title: true,
              department: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order as "asc" | "desc",
        },
      });
    } catch (_) {
      // ignore
    }

    // Do NOT fall back to sample data here; admin should reflect real submissions
    return NextResponse.json(applications ?? []);
  } catch (error) {
    console.error("Error fetching applications:", error);
    // Return empty list on error to avoid confusing sample entries
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const jobId = formData.get("jobId") as string;
    const applicantName = formData.get("applicantName") as string;
    const applicantEmail = formData.get("applicantEmail") as string;
    const applicantPhone = formData.get("applicantPhone") as string;
    const linkedinUrlRaw = formData.get("linkedinUrl") as string | null;
    const linkedinUrl = linkedinUrlRaw && linkedinUrlRaw.trim() ? linkedinUrlRaw.trim() : null;
    const coverLetterRaw = formData.get("coverLetter") as string | null;
    const coverLetter = coverLetterRaw && coverLetterRaw.trim() ? coverLetterRaw.trim() : null;
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    // Get job details for ATS scoring
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Save resume file
    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${resumeFile.name}`;
    const publicDir = join(process.cwd(), "public", "resumes");
    
    // Create directory if it doesn't exist
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }
    await writeFile(join(publicDir, fileName), buffer);

    const resumeUrl = `/resumes/${fileName}`;

    // Text extraction disabled for now
    let resumeText = "";

    // Calculate ATS score only
    const atsResult = calculateATSScore(
      resumeText || `${applicantName} ${applicantEmail}`,
      job.requirements,
      job.description,
      0
    );
    const finalAts = atsResult.score;

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone: applicantPhone || null,
        linkedinUrl,
        resumeUrl,
        resumeText: resumeText || null,
        coverLetter,
        atsScore: finalAts,
        experienceYears: null,
        skills: [],
        status: "APPLIED",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

