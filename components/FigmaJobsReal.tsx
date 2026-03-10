"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, ArrowLeft, Shield, Building2, X, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Label } from "@/figma/make/source/0H5CB8E8OD00iHIgbAC2Jb/components/ui/label";
import { Input } from "@/figma/make/source/0H5CB8E8OD00iHIgbAC2Jb/components/ui/input";
import { Button } from "@/figma/make/source/0H5CB8E8OD00iHIgbAC2Jb/components/ui/button";
import { Textarea } from "@/figma/make/source/0H5CB8E8OD00iHIgbAC2Jb/components/ui/textarea";

export interface JobItem {
  id: string;
  title: string;
  department: string;
  location?: string;
  type?: string;
  employmentType?: string;
  salaryRange?: string;
  summary?: string;
  description: string;
  requirements?: string;
  responsibilities?: string | null;
  benefits?: string | null;
}

export default function FigmaJobsReal({ jobs }: { jobs: JobItem[] }) {
  const [selected, setSelected] = useState<JobItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<{ atsScore?: number } | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    coverLetter: "",
    resume: null as File | null,
  });

  async function submitApplication() {
    if (!selected || !formData.resume || !formData.fullName || !formData.email) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("jobId", selected.id);
      fd.append("applicantName", formData.fullName);
      fd.append("applicantEmail", formData.email);
      fd.append("applicantPhone", formData.phone);
      if (formData.linkedin?.trim()) fd.append("linkedinUrl", formData.linkedin.trim());
      if (formData.coverLetter?.trim()) fd.append("coverLetter", formData.coverLetter.trim());
      fd.append("resume", formData.resume);
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      if (res.ok) {
        const app = await res.json();
        setSuccess({ atsScore: app.atsScore });
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to submit application");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit application");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="relative">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="text-xl">Careers</span>
              </div>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        </div>
      </motion.header>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Open Positions
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find your dream role and join our talented team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 max-w-4xl mx-auto">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200 bg-white rounded-2xl border"
                onClick={() => setSelected(job)}
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        {job.department && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        )}
                        {(job.type || job.employmentType) && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type || job.employmentType}
                          </span>
                        )}
                        {job.salaryRange && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salaryRange}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 self-start"
                    >
                      Apply
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {job.summary || job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "…" : ""}
                  </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <button aria-label="Close" onClick={() => setSelected(null)} className="absolute right-3 top-3 p-2 rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
                <h2 className="text-3xl mb-2">{selected.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-4">
                  {selected.department && (
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{selected.department}</span>
                  )}
                  {selected.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selected.location}</span>
                  )}
                  {(selected.type || selected.employmentType) && (
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selected.type || selected.employmentType}</span>
                  )}
                  {selected.salaryRange && (
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{selected.salaryRange}</span>
                  )}
                </div>
                <div className="space-y-8 text-slate-700">
                  {selected.description && (
                    <div>
                      <h3 className="text-xl mb-3">About the Role</h3>
                      <p className="leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                    </div>
                  )}
                  {selected.requirements && (
                    <div>
                      <h3 className="text-xl mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {selected.requirements.split(/\n+/).filter(Boolean).map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-blue-600 mt-1">•</span>
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selected.responsibilities && (
                    <div>
                      <h3 className="text-xl mb-3">Responsibilities</h3>
                      <ul className="space-y-2">
                        {selected.responsibilities.split(/\n+/).filter(Boolean).map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-purple-600 mt-1">•</span>
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selected.benefits && (
                    <div>
                      <h3 className="text-xl mb-3">Benefits</h3>
                      <ul className="space-y-2">
                        {selected.benefits.split(/\n+/).filter(Boolean).map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700">
                            <span className="text-green-600 mt-1">•</span>
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Apply Form */}
                {!success ? (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Apply for this position</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="fullName" placeholder="John Doe" className="mt-1" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="mt-1" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+1 (555) 000-0000" className="mt-1" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/johndoe" className="mt-1" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="resume">Resume <span className="text-red-500">*</span></Label>
                        <div className="mt-1 flex items-center gap-4">
                          <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })} className="hidden" />
                          <label htmlFor="resume" className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            Choose File
                          </label>
                          {formData.resume && (
                            <span className="text-sm text-slate-600">{formData.resume.name}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="cover">Cover Letter</Label>
                        <Textarea id="cover" rows={5} placeholder="Tell us why you're a great fit for this role..." className="mt-1" value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} />
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button disabled={uploading || !formData.resume || !formData.fullName || !formData.email} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={submitApplication}>
                        {uploading ? "Submitting…" : "Submit Application"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 bg-green-50 border-2 border-green-500 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-green-900 mb-2">Application submitted!</h3>
                    {typeof success.atsScore === "number" && (
                      <p className="text-green-800">ATS score: {success.atsScore}%</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


