"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, DollarSign, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  createdAt: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Job not found</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200"
        >
          <div className="space-y-4">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-3">
                {job.department}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-600">
              {job.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.employmentType && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>{job.employmentType}</span>
                </div>
              )}
              {job.salaryRange && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span>{job.salaryRange}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: job.requirements.replace(/\n/g, '<br />') }}
              />
            </motion.div>
          </div>

          {/* Apply Card */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white sticky top-8"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Apply?</h3>
                  <p className="text-blue-100">
                    Submit your resume and take the next step in your career.
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={`/apply/${job.id}`}
                    className="block w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-xl text-center hover:bg-blue-50 transition-colors"
                  >
                    Apply Now
                  </Link>
                </motion.div>

                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-100">
                      Quick application process
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-100">
                      ATS-friendly resume scoring
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-100">
                      Receive updates on your application
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

