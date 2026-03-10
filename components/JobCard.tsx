"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Briefcase, DollarSign, ArrowRight } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    department: string;
    location?: string;
    employmentType?: string;
    salaryRange?: string;
    description: string;
    createdAt: string;
  };
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
      
      <Link href={`/jobs/${job.id}`}>
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors tracking-tight">
                {job.title}
              </h3>
              <p className="text-sm font-semibold text-purple-600">
                {job.department}
              </p>
            </div>
            <motion.div
              whileHover={{ rotate: -45 }}
              className="p-2 rounded-full bg-brand-50 group-hover:bg-brand-100 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-brand-600" />
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-gray-600 line-clamp-2 text-sm">
            {job.description}
          </p>

          {/* Details */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
            {job.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.location}</span>
              </div>
            )}
            {job.employmentType && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{job.employmentType}</span>
              </div>
            )}
            {job.salaryRange && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span>{job.salaryRange}</span>
              </div>
            )}
          </div>

          {/* Apply button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <span className="inline-flex items-center text-sm font-semibold text-brand-600 group-hover:text-brand-700">
              Apply Now
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

