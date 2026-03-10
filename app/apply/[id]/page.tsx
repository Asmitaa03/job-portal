"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const applicationSchema = z.object({
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantEmail: z.string().email("Invalid email address"),
  applicantPhone: z.string().optional(),
  linkedinUrl: z.string().refine((val) => !val || val.trim() === "" || /^https?:\/\/.+/.test(val), {
    message: "Invalid URL format",
  }).optional(),
  coverLetter: z.string().optional(),
});

interface Job {
  id: string;
  title: string;
  department: string;
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [atsPreview, setAtsPreview] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(applicationSchema),
  });

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
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleFile(file: File) {
    if (file.type === "application/pdf" || file.type === "text/plain") {
      setResumeFile(file);
      // Preview file info
      const reader = new FileReader();
      reader.onload = (e) => {
        // Basic preview - would parse PDF in real app
        setAtsPreview({
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(2) + " KB",
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a PDF or text file");
    }
  }

  async function onSubmit(data: any) {
    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("jobId", params.id as string);
      formData.append("applicantName", data.applicantName);
      formData.append("applicantEmail", data.applicantEmail);
      formData.append("applicantPhone", data.applicantPhone || "");
      formData.append("resume", resumeFile);
      formData.append("linkedinUrl", data.linkedinUrl?.trim() || "");
      formData.append("coverLetter", data.coverLetter?.trim() || "");

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        setAtsPreview({
          ...atsPreview,
          atsScore: result.atsScore,
        });
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application");
    } finally {
      setUploading(false);
    }
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href={`/jobs/${params.id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Job</span>
          </Link>
        </motion.div>

        {/* Job Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Applying for: {job.title}
          </h2>
          <p className="text-gray-600">{job.department}</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">
                  Application Submitted Successfully!
                </h3>
              </div>
              {atsPreview?.atsScore !== undefined && (
                <div className="bg-white rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Your ATS Score:</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${atsPreview.atsScore}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        />
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {atsPreview.atsScore}%
                    </span>
                  </div>
                </div>
              )}
              <p className="text-green-700">
                Redirecting to job listings in 3 seconds...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Form */}
        {!success && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 space-y-6"
          >
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register("applicantName")}
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="John Doe"
                />
                {errors.applicantName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.applicantName.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register("applicantEmail")}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="john.doe@example.com"
                />
                {errors.applicantEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.applicantEmail.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  {...register("applicantPhone")}
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn URL (Optional)
                </label>
                <input
                  {...register("linkedinUrl")}
                  type="url"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
                {errors?.linkedinUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {(errors as any).linkedinUrl.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Resume Upload *</h3>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : resumeFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-4 rounded-full ${
                      resumeFile ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {resumeFile ? (
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    ) : (
                      <Upload className="w-12 h-12 text-blue-600" />
                    )}
                  </motion.div>
                  {resumeFile ? (
                    <div>
                      <p className="text-lg font-semibold text-green-700 mb-1">
                        {resumeFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-1">
                        Drag & drop your resume here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to browse (PDF or TXT)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {atsPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 rounded-xl p-4 flex items-center gap-3"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900">
                      Resume ready: {atsPreview.fileName}
                    </p>
                    <p className="text-xs text-blue-700">
                      {atsPreview.fileSize}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Cover Letter (Optional)</h3>
              <textarea
                {...register("coverLetter")}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Tell us why you're a great fit for this role..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={uploading || !resumeFile}
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all ${
                uploading || !resumeFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
}

