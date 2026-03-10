import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sampleJobs } from "@/lib/sample-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeParam = searchParams.get("active");

    let jobs = [] as any[];
    try {
      const where: any = {};
      if (activeParam === "true") where.isActive = true;
      else if (activeParam === "false") {
        // no filter -> return all
      } else {
        where.isActive = true;
      }

      jobs = await prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (_) {
      // ignore
    }

    // No sample fallback; return actual DB jobs only
    return NextResponse.json(jobs ?? []);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Return empty list on error
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      department,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      employmentType,
      salaryRange,
      isActive,
    } = body;

    const job = await prisma.job.create({
      data: {
        title,
        department,
        description,
        requirements,
        responsibilities,
        benefits,
        location,
        employmentType,
        salaryRange,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

