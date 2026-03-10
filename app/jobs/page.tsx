"use client";

import { useEffect, useState } from "react";
import FigmaJobsReal from "@/components/FigmaJobsReal";

interface Job {
  id: string;
  title: string;
  department: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  description: string;
  createdAt: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return jobs.length === 0 ? (
    <div className="text-center text-gray-600 py-24">No jobs available.</div>
  ) : (
    <FigmaJobsReal jobs={jobs} />
  );
}


