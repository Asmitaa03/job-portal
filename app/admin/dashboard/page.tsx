"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
} from "recharts";

interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  recentApplications: number;
  averageATSScore: number;
  applicationsByStatus: Array<{ name: string; value: number }>;
  applicationsByJob: Array<{ name: string; applications: number }>;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [jobsRes, applicationsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/applications"),
      ]);

      const jobs = await jobsRes.json();
      const applications = await applicationsRes.json();

      // Calculate stats
      const applicationsByStatus = [
        { name: "Applied", value: applications.filter((a: any) => a.status === "APPLIED").length },
        { name: "Reviewing", value: applications.filter((a: any) => a.status === "REVIEWING").length },
        { name: "Shortlisted", value: applications.filter((a: any) => a.status === "SHORTLISTED").length },
        { name: "Rejected", value: applications.filter((a: any) => a.status === "REJECTED").length },
        { name: "Hired", value: applications.filter((a: any) => a.status === "HIRED").length },
      ];

      const applicationsByJob = jobs.map((job: any) => ({
        name: job.title.length > 20 ? job.title.substring(0, 20) + "..." : job.title,
        applications: applications.filter((a: any) => a.jobId === job.id).length,
      }));

      const avgScore =
        applications.length > 0
          ? applications.reduce((sum: number, a: any) => sum + (a.atsScore || 0), 0) /
            applications.length
          : 0;

      const recentApplications = applications.filter((a: any) => {
        const date = new Date(a.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length;

      setStats({
        totalJobs: jobs.length,
        totalApplications: applications.length,
        recentApplications,
        averageATSScore: Math.round(avgScore),
        applicationsByStatus,
        applicationsByJob: applicationsByJob.filter((j: any) => j.applications > 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      change: "+24%",
    },
    {
      title: "Recent (7 days)",
      value: stats.recentApplications,
      icon: Clock,
      color: "from-pink-500 to-pink-600",
      change: "+8%",
    },
    {
      title: "Avg ATS Score",
      value: `${stats.averageATSScore}%`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      change: "+5%",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your recruitment portal</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Applications by Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.applicationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const { name, percent } = props;
                    const pct = typeof percent === "number" ? percent : 0;
                    return `${name ?? ""} ${(pct * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.applicationsByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Applications by Job */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Applications by Job
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.applicationsByJob}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

