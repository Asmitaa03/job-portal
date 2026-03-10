"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { Search, Download, ChevronDown, ChevronUp, X, Eye, Mail, Phone, Linkedin, Star, Trash2 } from "lucide-react";

interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  linkedinUrl?: string | null;
  resumeUrl: string;
  atsScore: number;
  experienceYears?: number;
  skills: string[];
  status: string;
  createdAt: string;
  job: {
    title: string;
    department: string;
  };
  resumeSummary?: any;
  coverLetter?: string | null;
}

interface DetailedApplication extends Application {
  resumeText?: string | null;
}

const statusColors: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700",
  REVIEWING: "bg-yellow-100 text-yellow-700",
  SHORTLISTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  HIRED: "bg-purple-100 text-purple-700",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("atsScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsApp, setDetailsApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [searchTerm, selectedJob, selectedStatus, sortBy, sortOrder, applications]);

  async function fetchApplications() {
    try {
      const response = await fetch("/api/applications");
      const data = await response.json();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterAndSort() {
    let filtered = [...applications];

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by job
    if (selectedJob) {
      filtered = filtered.filter((app) => app.job.title === selectedJob);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Application];
      let bValue: any = b[sortBy as keyof Application];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApplications(filtered);
  }

  async function updateStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function openDetails(app: Application) {
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/applications/${app.id}`);
      const data = await res.json();
      setDetailsApp({ ...app, ...data });
    } catch (e) {
      console.error(e);
      setDetailsApp(app);
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!detailsApp) return;
    try {
      const response = await fetch(`/api/applications/${detailsApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setDetailsApp({ ...detailsApp, status: updated.status });
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  }

  async function handleDelete() {
    if (!detailsApp) return;
    if (!confirm(`Are you sure you want to delete the application from ${detailsApp.applicantName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/applications/${detailsApp.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDetailsOpen(false);
        fetchApplications(); // Refresh the list
      } else {
        alert("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  }

  const jobs = Array.from(new Set(applications.map((app) => app.job.title)));
  const statuses = ["APPLIED", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];

  function formatDate(iso: string) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // summary UI removed

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-2">
            Manage and review all job applications
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Job Filter */}
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="atsScore-desc">ATS Score (High to Low)</option>
              <option value="atsScore-asc">ATS Score (Low to High)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="applicantName-asc">Name (A-Z)</option>
              <option value="applicantName-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-xl text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="grid grid-cols-12 px-6 py-3 text-sm font-semibold text-gray-600 border-b">
              <div className="col-span-3">Candidate</div>
              <div className="col-span-3">Position</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">ATS Score</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="grid grid-cols-12 items-center px-6 py-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div className="col-span-3">
                  <div className="font-semibold text-gray-900">{app.applicantName}</div>
                  <div className="text-gray-500 text-sm">{app.applicantEmail}</div>
                </div>
                <div className="col-span-3 text-gray-800">{app.job.title}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || statusColors.APPLIED}`}>
                          {app.status}
                        </span>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                    {Math.round(app.atsScore || 0)}%
                          </span>
                        </div>
                <div className="col-span-2 flex justify-end">
                  <button onClick={() => openDetails(app)} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2">
                    <Eye className="w-4 h-4" /> View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {/* Details Slide-over (Figma-style) */}
      <AnimatePresence>
        {detailsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex justify-end"
            onClick={() => setDetailsOpen(false)}
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-full max-w-xl h-full bg-white shadow-2xl p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Application Details</h3>
                <button onClick={() => setDetailsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              {detailsLoading || !detailsApp ? (
                <p className="text-gray-600">Loading…</p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Candidate Information</h4>
                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                      <div>
                        <span className="block text-sm text-gray-600">Name:</span>
                        <div className="text-gray-900 font-semibold">{detailsApp.applicantName}</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="flex items-center gap-1 text-gray-600"><Mail className="w-4 h-4"/> Email:</span>
                          <div className="text-gray-800">{detailsApp.applicantEmail}</div>
                        </div>
                        {detailsApp.applicantPhone && (
                          <div>
                            <span className="flex items-center gap-1 text-gray-600"><Phone className="w-4 h-4"/> Phone:</span>
                            <div className="text-gray-800">{detailsApp.applicantPhone}</div>
                          </div>
                        )}
                      </div>
                      {detailsApp.linkedinUrl && (
                        <div className="text-sm">
                          <span className="flex items-center gap-1 text-gray-600"><Linkedin className="w-4 h-4"/> LinkedIn:</span>
                          <a href={detailsApp.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{detailsApp.linkedinUrl}</a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <h4 className="text-sm text-gray-600">Position Applied</h4>
                      <div className="mt-2 inline-flex px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold">{detailsApp.job.title}</div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-600">ATS Score</h4>
                      <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs sm:text-sm font-semibold">
                        <Star className="w-4 h-4"/>
                        {Math.round(detailsApp.atsScore || 0)}%
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600">Applied Date</h4>
                    <p className="mt-1 text-gray-800">{formatDate(detailsApp.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600 mb-2">Status</h4>
                    <select
                      value={detailsApp.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  {detailsApp.coverLetter && (
                    <div>
                      <h4 className="text-base font-semibold">Cover Letter</h4>
                      <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 whitespace-pre-line text-gray-800 leading-relaxed">{detailsApp.coverLetter}</div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-semibold">Resume</h4>
                    <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Download className="w-5 h-5 text-blue-600"/>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-800">{detailsApp.resumeUrl.split('/').pop()}</div>
                        <div className="text-xs text-gray-500">Uploaded on {formatDate(detailsApp.createdAt)}</div>
                      </div>
                      <a href={detailsApp.resumeUrl} download className="px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 inline-flex items-center gap-2">
                        <Download className="w-4 h-4"/> Download
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t">
                    <a href={`mailto:${detailsApp.applicantEmail}`} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
                      <Mail className="w-4 h-4"/> Contact Candidate
                    </a>
                    <button className="flex-1 px-4 py-3 rounded-lg border text-gray-700 hover:bg-gray-100">Schedule Interview</button>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleDelete}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4"/> Delete Application
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
              </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}


