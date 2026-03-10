import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    const job = await prisma.job.update({
      where: { id },
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
        isActive,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    const message = error instanceof Error ? error.message : "Failed to update job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}

